import { Redirect } from 'expo-router';

// El entry point redirige al splash que maneja la lógica de navegación
export default function Index() {
  return <Redirect href={"/splash" as any} />;
}
