# App Store Review Notes — ProAhorro

## Cuenta de demostración

Para que el equipo de revisión de Apple pueda probar todas las funcionalidades de la app, proporcionamos la siguiente cuenta de demostración con datos precargados.

**Email:** review@proahorro.app
**Contraseña:** ProAhorro2026!

Esta cuenta tiene:
- Total ahorrado en pesos dominicanos (DOP)
- 3 metas activas con progreso visible
- Historial de movimientos recientes
- Una repartición de ahorro entre metas
- Todos los gráficos con datos reales

---

## Ruta de eliminación de cuenta

Como la app requiere registro de cuenta, implementamos eliminación de cuenta dentro de la app cumpliendo con las directrices de Apple:

**Ruta exacta:**
Cuenta (pestaña inferior derecha) → Privacidad y seguridad → Eliminar cuenta

**Flujo:**
1. Se muestra advertencia de qué datos se eliminarán
2. El usuario debe escribir "ELIMINAR" para confirmar
3. Se elimina la cuenta y todos los datos permanentemente
4. Se cierra la sesión automáticamente

---

## Descripción de la app

ProAhorro es una aplicación de organización personal de ahorros. Permite a los usuarios:

- Registrar montos de ahorro manualmente
- Crear metas de ahorro (vacaciones, emergencias, etc.)
- Repartir un monto entre varias metas simultáneamente
- Ver historial, gráficos y progreso de metas

**ProAhorro NO es un banco, NO procesa pagos y NO mueve dinero real.** Los datos son ingresados manualmente por el usuario para propósitos organizativos personales.

---

## Permisos solicitados

| Permiso | Uso |
|---|---|
| Face ID | Opcional: proteger el acceso a la app con biometría. Se activa solo si el usuario lo habilita en configuración. El usuario ve la descripción antes de activarlo. |

La app NO solicita acceso a: cámara, micrófono, contactos, ubicación, notificaciones push (por ahora), Bluetooth ni ningún otro permiso.

---

## Política de privacidad

URL: https://proahorro.app/privacy

La política declara correctamente:
- Los datos recopilados (nombre, email, ahorros manuales, metas, configuración)
- El proveedor de backend (Supabase)
- Que no se venden datos a terceros
- El proceso de eliminación de cuenta
- Los derechos del usuario

---

## Notas adicionales

- La app funciona en modo portrait únicamente
- Compatible con iOS 15.1 y superior
- Se ha probado en iPhone 14, iPhone 15 Pro y iPhone SE (3ª generación)
- No hay funcionalidades que requieran pago o suscripción en la versión actual
- No hay publicidad en la app
- La app no requiere conectividad constante (muestra datos locales mientras carga)
