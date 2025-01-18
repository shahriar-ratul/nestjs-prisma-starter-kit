import * as request from "supertest";

describe("AppController (e2e)", () => {
  const authUrl = process.env.BASE_URL + "/api/auth";

  describe("POST /api/auth/login", () => {
    it("should return 200", () => {
      const requestBody = {
        username: "super_admin",
        password: "password",
      };

      return request(authUrl)
        .post("/login")
        .set("Accept", "application/json")
        .send(requestBody)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            statusCode: 200,
            success: true,
            data: {
              accessToken: expect.any(String),
              refreshToken: expect.any(String),
              expiresIn: expect.any(Number),
            },
          });
        });
    });

    it("should return 401", () => {
      const requestBody = {
        username: "test@test.com",
        password: "password",
      };

      return request(authUrl)
        .post("/login")
        .send(requestBody)
        .expect((res) => {
          expect(res.body).toMatchObject({
            statusCode: 422,
            success: false,
            message: "Invalid credentials",
          });
        });
    });

    it("should return 422", () => {
      const requestBody = {
        username: "super_admin",
        password: "pass",
      };
      return request(authUrl).post("/login").send(requestBody).expect(422);
    });

    it("should return 422", () => {
      const requestBody = {
        username: "",
        password: "",
      };
      return request(authUrl).post("/login").send(requestBody).expect(422);
    });
  });
});
