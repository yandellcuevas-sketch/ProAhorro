# Política de Privacidad — ProAhorro

**Última actualización:** Mayo 2025

**ProAhorro** ("la aplicación", "nosotros") es una herramienta de organización personal de ahorros. Esta política explica qué datos recopilamos, cómo los usamos y cómo puedes eliminarlos.

---

## 1. Quiénes somos

ProAhorro es una aplicación móvil desarrollada de manera independiente para ayudar a las personas a registrar, organizar y visualizar sus ahorros personales. **ProAhorro no es un banco, no está regulada como institución financiera y no procesa pagos ni mueve dinero real.**

Contacto: **soporte@proahorro.app**

---

## 2. Datos que recopilamos

### 2.1 Datos que tú nos proporcionas directamente

| Tipo de dato | Descripción | Propósito |
|---|---|---|
| Nombre | Tu nombre o apodo | Personalizar la experiencia |
| Email | Dirección de correo electrónico | Autenticación y recuperación de contraseña |
| Contraseña | Almacenada de forma segura mediante Supabase Auth (hash bcrypt) | Inicio de sesión |
| Ahorros | Montos, fechas, métodos y notas que ingresas manualmente | Funcionalidad principal |
| Metas | Nombre, monto objetivo, fecha límite, icono y color | Funcionalidad de metas |
| Monedas | Preferencia de moneda principal | Configuración de cuenta |
| Configuración | Tema, PIN, biometría, notificaciones | Preferencias de usuario |

### 2.2 Datos generados automáticamente

| Tipo de dato | Descripción |
|---|---|
| ID de usuario | UUID generado por Supabase Auth |
| Fechas de creación | Timestamps de cuando se crean registros |
| Proveedor de autenticación | "email", "apple" o "google" |

### 2.3 Datos que NO recopilamos

- Datos financieros reales (saldos bancarios, tarjetas, cuentas)
- Datos de ubicación
- Contactos
- Historial de navegación
- Datos biométricos (Face ID se gestiona localmente por el sistema operativo)
- Fotos o archivos

---

## 3. Cómo usamos los datos

Usamos tus datos exclusivamente para:

1. **Proveer la funcionalidad de la app:** mostrar tus ahorros, metas, historial y gráficos
2. **Autenticación:** verificar tu identidad al iniciar sesión
3. **Recuperación de contraseña:** enviarte un email para restablecer acceso
4. **Personalización:** recordar tus preferencias de moneda, tema y método de ahorro

**No vendemos, compartimos ni cedemos tus datos a terceros con fines publicitarios o comerciales.**

---

## 4. Con quién compartimos los datos

### 4.1 Supabase

Nuestro backend utiliza [Supabase](https://supabase.com) (Supabase Inc., EE.UU.) como proveedor de:
- Base de datos PostgreSQL (almacenamiento de ahorros, metas, configuración)
- Autenticación (gestión de sesiones)
- Infraestructura en la nube (AWS us-east-1)

Supabase actúa como procesador de datos bajo nuestras instrucciones. Consulta su [política de privacidad](https://supabase.com/privacy).

### 4.2 Ningún otro tercero

No usamos servicios de analytics, publicidad, seguimiento o perfilado de usuarios.

---

## 5. Seguridad de los datos

- Todas las comunicaciones usan **TLS/HTTPS**
- Las contraseñas se almacenan como **hash bcrypt** — nunca en texto plano
- Row Level Security (RLS) en Supabase garantiza que **cada usuario solo puede acceder a sus propios datos**
- La sesión de usuario se almacena de forma segura en **Expo SecureStore** (iOS Keychain / Android Keystore)
- El PIN opcional **no se almacena en texto plano**
- Face ID / biometría se gestiona **localmente** por el sistema operativo; los datos biométricos nunca llegan a nuestros servidores

---

## 6. Retención de datos

Retenemos tus datos mientras tu cuenta esté activa. Al eliminar tu cuenta:

- Todos tus ahorros, metas, historial y configuración son eliminados permanentemente de la base de datos
- La eliminación se completa en tiempo real
- Datos anónimos de operaciones completadas pueden retenerse hasta 30 días adicionales en logs del sistema antes de ser purgados

---

## 7. Tus derechos

Tienes derecho a:

- **Acceder** a tus datos: todos están visibles dentro de la app
- **Corregir** tus datos: puedes editar tu perfil en cualquier momento
- **Exportar** tus datos: disponible en Cuenta → Exportar datos
- **Eliminar** tu cuenta y todos tus datos: disponible en **Cuenta → Privacidad y seguridad → Eliminar cuenta**

Para ejercer estos derechos también puedes contactarnos en **soporte@proahorro.app**.

---

## 8. Menores de edad

ProAhorro no está dirigida a menores de 13 años. No recopilamos intencionalmente datos de menores. Si eres padre o tutor y crees que tu hijo ha creado una cuenta, contáctanos para eliminarla.

---

## 9. Transferencias internacionales

Los datos se almacenan en servidores de Supabase ubicados en EE.UU. (AWS us-east-1). Al usar ProAhorro, aceptas esta transferencia internacional de datos.

---

## 10. Cambios a esta política

Notificaremos cualquier cambio material a esta política mediante una notificación en la app o por email. El uso continuado de la app después de la notificación implica aceptación de los cambios.

---

## 11. Contacto

Para preguntas, solicitudes de datos o reportes de privacidad:

**Email:** soporte@proahorro.app
**Sitio web:** https://proahorro.app/privacy
