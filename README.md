# ProAhorro

> **Controla tus ahorros con claridad.**

ProAhorro es una app móvil premium de control de ahorros personales, construida con Expo React Native y Supabase. Diseñada para publicación en iOS App Store y Google Play.

---

## 🚀 Stack Tecnológico

| Categoría | Tecnología |
|---|---|
| Frontend | Expo SDK 51, React Native, TypeScript |
| Navegación | React Navigation v6 |
| Formularios | React Hook Form + Zod |
| Estado | Zustand |
| Animaciones | React Native Reanimated 3 |
| Gráficos | Victory Native XL |
| Auth segura | Expo SecureStore |
| Backend | Supabase (Auth + PostgreSQL + RLS) |
| Build | EAS Build |
| CI/CD | GitHub Actions |

---

## 📁 Estructura del Proyecto

```
ProAhorro/
├── README.md
├── package.json
├── app.json
├── eas.json
├── .env.example
├── tsconfig.json
├── babel.config.js
├── .github/
│   └── workflows/
│       └── supabase-keepalive.yml
├── docs/
│   ├── PRODUCT_SPEC.md
│   ├── APP_STORE_CHECKLIST.md
│   ├── PRIVACY_POLICY_DRAFT.md
│   ├── TERMS_DRAFT.md
│   └── REVIEW_NOTES.md
├── frontend/
│   ├── app/                        ← Expo Router (entry)
│   └── src/
│       ├── assets/
│       │   ├── images/imglogo.png
│       │   ├── icons/
│       │   └── fonts/
│       ├── components/
│       │   ├── brand/
│       │   ├── ui/
│       │   ├── cards/
│       │   ├── charts/
│       │   ├── forms/
│       │   └── layout/
│       ├── screens/
│       │   ├── splash/
│       │   ├── auth/
│       │   ├── onboarding/
│       │   ├── dashboard/
│       │   ├── savings/
│       │   ├── split/
│       │   ├── goals/
│       │   ├── history/
│       │   ├── charts/
│       │   └── account/
│       ├── navigation/
│       ├── services/
│       ├── store/
│       ├── hooks/
│       ├── utils/
│       ├── constants/
│       ├── theme/
│       ├── types/
│       └── validations/
├── backend/
│   └── supabase/
│       ├── migrations/
│       ├── policies/
│       ├── functions/
│       └── seed.sql
├── legal/
├── store-assets/
│   ├── app-store/
│   └── google-play/
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## ⚙️ Configuración Inicial

### 1. Clonar e instalar dependencias

```bash
cd ProAhorro
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env
# Editar .env con tus credenciales de Supabase
```

Variables requeridas:
```
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 3. Supabase — Ejecutar migraciones

```bash
# Instalar Supabase CLI
npm install -g supabase

# Iniciar sesión
supabase login

# Vincular proyecto
supabase link --project-ref TU_PROJECT_REF

# Ejecutar migraciones
supabase db push
```

### 4. Iniciar en desarrollo

```bash
npx expo start
```

### 5. Build iOS con EAS

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Build para simulador
eas build --platform ios --profile development

# Build para App Store
eas build --platform ios --profile production
```

---

## 🗄️ Base de Datos Supabase

### Tablas

| Tabla | Descripción |
|---|---|
| `users` | Perfil del usuario + soft delete |
| `currencies` | Monedas del sistema y personalizadas |
| `goals` | Metas de ahorro |
| `saving_batches` | Lotes de ahorro (para reparticiones) |
| `savings` | Movimientos individuales de ahorro |
| `settings` | Configuración por usuario |

### Row Level Security

Todas las tablas tienen RLS activo. Cada usuario solo puede acceder a sus propios datos mediante `auth.uid() = user_id`.

---

## 🍎 App Store

- **Bundle ID:** `com.proahorro.app`
- **Categoría:** Finance
- **Cuenta demo:** review@proahorro.app / ProAhorro2026!
- **Ruta eliminar cuenta:** Cuenta → Privacidad y seguridad → Eliminar cuenta

Ver `store-assets/app-store/` para metadata completa.

---

## 📋 Documentación

- [Especificación del producto](docs/PRODUCT_SPEC.md)
- [Checklist App Store](docs/APP_STORE_CHECKLIST.md)
- [Política de privacidad](legal/privacy-policy.md)
- [Términos de uso](legal/terms-of-use.md)
- [Eliminación de datos](legal/data-deletion.md)
- [Review Notes](store-assets/app-store/review-notes.md)

---

## 🔒 Seguridad

- Sesión persistente con `expo-secure-store`
- Row Level Security en todas las tablas
- Sin almacenamiento local de datos sensibles
- Eliminación de cuenta dentro de la app (cumplimiento Apple)
- Face ID opcional con descripción declarada en Info.plist

---

## ⚠️ Aviso Legal

ProAhorro **no es un banco ni institución financiera**. No procesa pagos, no mueve dinero real. Es una herramienta de organización personal de ahorros. Los datos financieros son ingresados manualmente por el usuario.

---

## 📞 Soporte

- Email: soporte@proahorro.app
- Política de privacidad: https://proahorro.app/privacy
- Términos de uso: https://proahorro.app/terms
