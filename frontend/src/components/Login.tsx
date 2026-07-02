import { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface LoginFields {
  email?: string;
  password?: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
  };
}

interface LoginProps {
  onLoginSuccess: (role: "ADMIN" | "USER") => void;
}

function Login({ onLoginSuccess }: LoginProps) {
  const [loading, setLoading] = useState(false);

  // Ant Design pasa los valores del formulario directamente en un objeto limpio
  const onFinish = async (values: LoginFields) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3005/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const resData: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Credenciales incorrectas");
      }

      if (resData.success && resData.data?.token) {
        const token = resData.data.token;
        localStorage.setItem("token", token);

        // Decodificamos el payload de tu JWT para obtener el rol de forma rápida
        const payloadBase64 = token.split(".")[1];
        const decodedPayload = JSON.parse(window.atob(payloadBase64));

        message.success("¡Inicio de sesión exitoso!");
        onLoginSuccess(decodedPayload.role); // Enviamos el rol ('ADMIN' o 'USER') a App.tsx
      }
    } catch (err) {
      if (err instanceof Error) {
        message.error(err.message);
      } else {
        message.error("Error de conexión con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "screen",
        height: "100vh",
        backgroundColor: "#f0f2f5",
        padding: "16px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={2} style={{ color: "#1677ff", margin: 0 }}>
            UTN Portal
          </Title>
          <Text type="secondary">Ingresa tus credenciales universitarias</Text>
        </div>

        <Form
          name="login_form"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu correo electrónico",
              },
              {
                type: "email",
                message: "El formato del correo electrónico no es válido",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
              placeholder="correo@utn.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Por favor ingresa tu contraseña" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
              placeholder="Contraseña"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{ borderRadius: "6px", fontWeight: 500 }}
            >
              Ingresar al Sistema
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export { Login };
