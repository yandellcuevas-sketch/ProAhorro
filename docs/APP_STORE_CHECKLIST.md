# App Store Checklist — ProAhorro
## Checklist completo para publicación en iOS App Store

---

## ✅ Configuración Técnica

- [ ] `app.json` configurado con nombre "ProAhorro", bundleIdentifier "com.proahorro.app"
- [ ] `eas.json` con perfiles development, preview, production
- [ ] iOS deployment target: 15.1+
- [ ] `supportsTablet: false` en app.json
- [ ] Icono 1024×1024 sin transparencia (imglogo.png)
- [ ] Splash screen configurado con fondo #064E2E
- [ ] Face ID description en Info.plist
- [ ] `ITSAppUsesNonExemptEncryption: false` declarado
- [ ] Build number: 1 (primera submisión)
- [ ] Version: 1.0.0

## ✅ Cuenta de App Store Connect

- [ ] Apple Developer Program activo ($99/año)
- [ ] Apple Developer Account configurado
- [ ] App creada en App Store Connect
- [ ] Bundle ID registrado en Apple
- [ ] Equipo de desarrollo configurado en EAS
- [ ] Certificados de distribución creados
- [ ] Provisioning Profile de distribución activo

## ✅ EAS Build

- [ ] `eas build --platform ios --profile production` ejecutado exitosamente
- [ ] Build sin errores de TypeScript
- [ ] Build sin warnings críticos de Expo
- [ ] IPA generado correctamente
- [ ] Probado en dispositivo físico real
- [ ] Probado en TestFlight antes de submission

## ✅ Metadata App Store Connect

- [ ] Nombre: ProAhorro (30 chars máx)
- [ ] Subtítulo: Controla tus ahorros (30 chars máx)
- [ ] Categoría: Finance
- [ ] Keywords completados (100 chars)
- [ ] Descripción completa (no excede 4000 chars)
- [ ] URL de soporte: https://proahorro.app/support
- [ ] URL de política de privacidad: https://proahorro.app/privacy
- [ ] Email de soporte: soporte@proahorro.app

## ✅ Screenshots

- [ ] Screenshot 1: Dashboard con datos demo (no splash)
- [ ] Screenshot 2: Agregar ahorro
- [ ] Screenshot 3: Repartir entre metas
- [ ] Screenshot 4: Lista de metas
- [ ] Screenshot 5: Historial
- [ ] Screenshot 6: Gráficos
- [ ] Screenshot 7: Cuenta (eliminar cuenta visible)
- [ ] Tamaño 6.9" iPhone (requerido)
- [ ] Tamaño 6.5" iPhone (requerido)
- [ ] Ningún screenshot muestra splash/logo como pantalla principal
- [ ] Todos los datos son demo reales, no mockups

## ✅ Review Notes (Information for App Review)

- [ ] Cuenta demo configurada: review@proahorro.app / ProAhorro2026!
- [ ] Datos demo cargados en la cuenta de revisión
- [ ] Ruta de eliminación de cuenta documentada
- [ ] Explicación de que la app NO mueve dinero real
- [ ] Sign in with Apple implementado (si se ofrece login alternativo)

## ✅ Política de Privacidad

- [ ] Política de privacidad publicada en URL accesible
- [ ] Declara los datos que se recopilan (nombre, email, ahorros manuales)
- [ ] Menciona Supabase como proveedor de backend
- [ ] No dice "no recopilamos datos" (sí recopilamos datos de auth)
- [ ] Incluye proceso de eliminación de datos
- [ ] Incluye email de contacto

## ✅ App Privacy (Privacy Nutrition Label)

Configurar en App Store Connect → App Privacy:

**Datos recopilados y vinculados al usuario:**
- [ ] Datos de contacto: Email (autenticación)
- [ ] Nombre (perfil de usuario)
- [ ] Datos del usuario: Historial de uso (ahorros, metas)

**Datos NO recopilados:**
- [ ] Sin datos de diagnóstico/analytics
- [ ] Sin datos de ubicación
- [ ] Sin datos financieros bancarios
- [ ] Sin publicidad/seguimiento

## ✅ Eliminación de Cuenta (OBLIGATORIO desde App Store Guidelines 5.1.1)

- [ ] Pantalla de eliminación implementada: DeleteAccountScreen.tsx
- [ ] Ruta documentada: Cuenta → Privacidad y seguridad → Eliminar cuenta
- [ ] Requiere confirmación activa del usuario (escribir "ELIMINAR")
- [ ] Elimina todos los datos del servidor (Supabase)
- [ ] Cierra la sesión después de eliminar
- [ ] Limpia cache local
- [ ] La eliminación es inmediata (no días de espera en la app)
- [ ] Función SQL `delete_current_user_data()` implementada con RLS

## ✅ Permisos

- [ ] Face ID: declarado en Info.plist con descripción clara
- [ ] Face ID es OPCIONAL, no bloquea el uso de la app
- [ ] Sin permisos innecesarios (sin cámara, micrófono, contactos, ubicación)

## ✅ Funcionalidad

- [ ] Login funciona con la cuenta demo
- [ ] Dashboard muestra datos cargados de Supabase
- [ ] Agregar ahorro funciona
- [ ] Crear meta funciona
- [ ] Repartir ahorro funciona
- [ ] Historial muestra movimientos
- [ ] Gráficos muestran datos (no están vacíos con cuenta demo)
- [ ] Eliminar cuenta funciona completamente
- [ ] Cerrar sesión funciona
- [ ] Recuperar contraseña funciona (envía email real)
- [ ] No hay pantallas congeladas
- [ ] No hay botones que no hagan nada
- [ ] No hay crashes obvios

## ✅ Cumplimiento Guidelines Apple

- [ ] App no promete funcionalidades que no existen
- [ ] No hay contenido inapropiado
- [ ] No hay compras in-app no declaradas
- [ ] No hay publicidad
- [ ] La app es funcional en modo portrait
- [ ] Compatible con iOS 15.1+
- [ ] Sin frameworks o SDKs en lista negra de Apple

## ✅ Supabase Keep-Alive

- [ ] GitHub Actions workflow configurado
- [ ] Secrets SUPABASE_URL y SUPABASE_ANON_KEY en el repositorio
- [ ] Workflow ejecutándose cada 2 días correctamente

---

## Comandos finales para publicar

```bash
# 1. Build de producción
eas build --platform ios --profile production

# 2. Subir a App Store Connect
eas submit --platform ios --profile production

# 3. En App Store Connect:
#    - Completar metadata
#    - Subir screenshots
#    - Configurar App Privacy
#    - Agregar Review Notes
#    - Submit for Review
```

---

**Fecha de preparación:** Mayo 2025
**Versión a publicar:** 1.0.0 (Build 1)
