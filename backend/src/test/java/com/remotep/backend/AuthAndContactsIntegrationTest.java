package com.remotep.backend;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.util.Map;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthAndContactsIntegrationTest {
    private static final String ADMIN_EMAIL = "test-admin@remotep.local";
    private static final String ADMIN_PASSWORD = "test-admin-password-2026";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void registerCreatesUserAndReturnsTokens() throws Exception {
        String email = uniqueEmail("student");

        mockMvc.perform(postJson("/api/auth/register", Map.of(
                        "name", "Student User",
                        "email", email,
                        "password", "password123"
                )))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.refreshToken").isString())
                .andExpect(jsonPath("$.user.email").value(email))
                .andExpect(jsonPath("$.user.role").value("USER"));
    }

    @Test
    void loginReturnsAdminRole() throws Exception {
        mockMvc.perform(postJson("/api/auth/login", Map.of(
                        "email", ADMIN_EMAIL,
                        "password", ADMIN_PASSWORD
                )))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.user.email").value(ADMIN_EMAIL))
                .andExpect(jsonPath("$.user.role").value("ADMIN"));
    }

    @Test
    void publicUserCanCreateContactRequest() throws Exception {
        mockMvc.perform(postJson("/api/contacts", Map.of(
                        "name", "Client",
                        "email", uniqueEmail("client"),
                        "message", "Need a diploma project website"
                )))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("NEW"))
                .andExpect(jsonPath("$.priority").value("MEDIUM"))
                .andExpect(jsonPath("$.statusHistory", hasSize(1)))
                .andExpect(jsonPath("$.telegramNotifications[0].status").value("SKIPPED"));
    }

    @Test
    void contactsListIsForbiddenWithoutToken() throws Exception {
        mockMvc.perform(get("/api/contacts"))
                .andExpect(status().isForbidden());
    }

    @Test
    void regularUserCannotOpenContactsList() throws Exception {
        String userToken = registerUserAndGetToken(uniqueEmail("regular"));

        mockMvc.perform(get("/api/contacts")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void regularUserCanSeeOnlyOwnContactRequests() throws Exception {
        String ownerEmail = uniqueEmail("owner");
        String ownerToken = registerUserAndGetToken(ownerEmail);
        String otherToken = registerUserAndGetToken(uniqueEmail("other"));
        String contactEmail = uniqueEmail("owned-lead");

        mockMvc.perform(postJson("/api/contacts", Map.of(
                        "name", "Owner Lead",
                        "email", contactEmail,
                        "message", "This request belongs to the logged in user"
                )).header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userEmail").value(ownerEmail));

        mockMvc.perform(get("/api/contacts/my")
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(contactEmail)));

        mockMvc.perform(get("/api/contacts/my")
                        .header("Authorization", "Bearer " + otherToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void adminCanSeeContactRequests() throws Exception {
        String contactEmail = uniqueEmail("lead");
        mockMvc.perform(postJson("/api/contacts", Map.of(
                        "name", "Lead",
                        "email", contactEmail,
                        "message", "Please contact me"
                )))
                .andExpect(status().isCreated());

        String adminToken = loginAndGetToken(ADMIN_EMAIL, ADMIN_PASSWORD);

        mockMvc.perform(get("/api/contacts")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(contactEmail)));
    }

    @Test
    void adminCanUpdateContactWorkflowFields() throws Exception {
        MvcResult created = mockMvc.perform(postJson("/api/contacts", Map.of(
                        "name", "Workflow Lead",
                        "email", uniqueEmail("workflow"),
                        "message", "Need admin processing"
                )))
                .andExpect(status().isCreated())
                .andReturn();
        String contactId = String.valueOf(readJson(created).get("id"));
        String adminToken = loginAndGetToken(ADMIN_EMAIL, ADMIN_PASSWORD);

        mockMvc.perform(patchJson("/api/contacts/" + contactId, Map.of(
                        "status", "IN_PROGRESS",
                        "priority", "HIGH",
                        "comment", "Client was contacted"
                )).header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"))
                .andExpect(jsonPath("$.priority").value("HIGH"))
                .andExpect(jsonPath("$.comments[0].comment").value("Client was contacted"))
                .andExpect(jsonPath("$.statusHistory", hasSize(2)));
    }

    @Test
    void publicContentComesFromDatabase() throws Exception {
        mockMvc.perform(get("/api/content/services?lang=ru"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(6)))
                .andExpect(jsonPath("$[0].title").value("Веб-разработка"))
                .andExpect(jsonPath("$[0].description").value("Создание корпоративных сайтов, лендингов и веб-приложений на React с адаптивным интерфейсом."));

        mockMvc.perform(get("/api/content/portfolio?lang=kz"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[0].category").value("Веб-әзірлеу"))
                .andExpect(jsonPath("$[0].description").value("Жеке кабинеті және төлем сервистерімен интеграциясы бар қаржы компаниясына арналған аналитикалық жүйе."));
    }

    @Test
    void swaggerOpenApiSpecIsPublic() throws Exception {
        mockMvc.perform(get("/api/docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.info.title").value("RemoteP API"));
    }

    private String registerUserAndGetToken(String email) throws Exception {
        MvcResult result = mockMvc.perform(postJson("/api/auth/register", Map.of(
                        "name", "Regular User",
                        "email", email,
                        "password", "password123"
                )))
                .andExpect(status().isCreated())
                .andReturn();

        return tokenFrom(result);
    }

    private String loginAndGetToken(String email, String password) throws Exception {
        MvcResult result = mockMvc.perform(postJson("/api/auth/login", Map.of(
                        "email", email,
                        "password", password
                )))
                .andExpect(status().isOk())
                .andReturn();

        return tokenFrom(result);
    }

    private MockHttpServletRequestBuilder postJson(String url, Map<String, String> body) throws Exception {
        return post(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body));
    }

    private MockHttpServletRequestBuilder patchJson(String url, Map<String, String> body) throws Exception {
        return patch(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body));
    }

    private String tokenFrom(MvcResult result) throws Exception {
        return (String) readJson(result).get("token");
    }

    private Map<String, Object> readJson(MvcResult result) throws Exception {
        Map<String, Object> body = objectMapper.readValue(
                result.getResponse().getContentAsString(),
                new TypeReference<>() {
                }
        );
        return body;
    }

    private String uniqueEmail(String prefix) {
        return prefix + "-" + System.nanoTime() + "@example.com";
    }
}
