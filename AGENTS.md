# Reglas de Trabajo para OpenCode - At Time Web

## Contexto y Alcance
- Proyecto: Web landing + inscripción de piloto At Time (Fase 1).
- Stack: Astro, React, TypeScript (modo estricto), Supabase, CSS con tokens (`tokens.css`).
- Sistema operativo de desarrollo: Windows.

## Reglas de Código Obligatorias
1. **TypeScript Estricto:** No usar `any`. Tipar explícitamente props, eventos y respuestas de API.
2. **Diseño Mobile-First:** Usar CSS nativo con variables de `src/styles/tokens.css`.
3. **Cero Dependencias No Pedidas:** No instalar paquetes de npm ni agregar librerías externas a menos que se indique explícitamente en el prompt.
4. **Cumplimiento Legal (Ley 1581):** Todo endpoint de inscripción debe exigir el campo de consentimiento explícito (`autorizacion_datos`).

## Reglas de Ejecución y Git
1. Ejecutar únicamente la tarea descrita en el prompt. No asumir ni avanzar a fases 2 o 3.
2. No borrar archivos de la carpeta `docs/` ni este archivo `AGENTS.md`.
3. Los secretos van en `.env` (nunca en el repo). Modificar únicamente `.env.example` con llaves vacías.
4. Al terminar cada tarea exitosamente, realizar un commit Git con mensaje descriptivo.