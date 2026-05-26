# ProAhorro — Product Specification

## Visión del producto

ProAhorro es una app móvil de control de ahorros personales, diseñada para personas que quieren organizar su dinero de forma simple, visual y sin la complejidad de apps bancarias.

**Propuesta de valor:** "Ahorra con claridad."

---

## Audiencia objetivo

- Personas entre 18-45 años
- Sin educación financiera formal avanzada
- Con ingresos regulares que quieren ahorrar más
- Usuarios de República Dominicana (mercado principal) y mercados de habla hispana

---

## Casos de uso principales

### 1. Registrar un ahorro libre
Usuario recibe su salario y quiere registrar que guardó RD$5,000.
→ Dashboard → + Ahorro → Monto → Moneda → Método → Ahorro libre → Guardar

### 2. Asociar ahorro a meta
Usuario recibe un bono y quiere aplicarlo todo a su meta de viaje.
→ + Ahorro → Meta: Viaje a Europa → Guardar → Ver progreso actualizado

### 3. Repartir un monto entre varias metas
Usuario ahorra RD$8,000 y quiere dividirlos: RD$4,000 al viaje, RD$2,500 a emergencia, RD$1,000 al carro, sobrante libre.
→ Repartir → Total: 8,000 → Asignar por meta → Guardar → Ver batch en historial

### 4. Revisar progreso de meta
Usuario quiere saber si va bien con su meta de viaje.
→ Metas → Viaje a Europa → Ver: 58% / RD$87,500 de RD$150,000 / "Al ritmo actual llegarás en 5 meses"

### 5. Eliminar cuenta
Usuario quiere borrar todos sus datos.
→ Cuenta → Privacidad y seguridad → Eliminar cuenta → Escribir ELIMINAR → Confirmar

---

## Pantallas del MVP

| Pantalla | Prioridad | Status |
|---|---|---|
| SplashScreen | P0 | ✅ |
| OnboardingScreen | P0 | ✅ |
| LoginScreen | P0 | ✅ |
| RegisterScreen | P0 | ✅ |
| ForgotPasswordScreen | P1 | 🔲 |
| DashboardScreen | P0 | ✅ |
| AddSavingScreen | P0 | 🔲 |
| SplitSavingScreen | P0 | 🔲 |
| GoalsScreen | P0 | 🔲 |
| GoalDetailScreen | P1 | 🔲 |
| CreateGoalScreen | P0 | 🔲 |
| HistoryScreen | P0 | 🔲 |
| SavingDetailScreen | P1 | 🔲 |
| ChartsScreen | P1 | 🔲 |
| AccountScreen | P0 | 🔲 |
| PrivacySecurityScreen | P0 | 🔲 |
| DeleteAccountScreen | P0 | ✅ |
| CurrencySettingsScreen | P2 | 🔲 |

---

## Stack de decisiones

| Decisión | Elección | Motivo |
|---|---|---|
| Navegación | React Navigation | Estándar de la industria, buen soporte Expo |
| Estado | Zustand | Simple, mínimo boilerplate, excelente DX |
| Forms | React Hook Form + Zod | Validación robusta, tipado TypeScript |
| Animaciones | Reanimated 3 | Nativo, sin jank en iOS |
| Backend | Supabase Free | PostgreSQL real, Auth incluido, RLS, 0$ inicial |
| Sesión | SecureStore | iOS Keychain, más seguro que AsyncStorage |
| Gráficos | Victory Native XL | Compatible con Reanimated, buena API |

---

## Reglas de negocio

1. **Un ahorro siempre tiene**: monto > 0, moneda, fecha, método
2. **Una meta siempre tiene**: nombre, monto objetivo > 0, moneda
3. **Una repartición**: suma de splits ≤ total, mínimo 1 meta
4. **Meta completada**: no acepta más ahorros
5. **Eliminar ahorro asociado a meta**: recalcula current_amount automáticamente
6. **Eliminar cuenta**: elimina todos los datos permanentemente, sin excepción
7. **Datos en Supabase**: son la fuente de verdad, no el local storage
