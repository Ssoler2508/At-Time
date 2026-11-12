# Contexto del proyecto At Time para construir la web

Pega este archivo al inicio de un chat nuevo y di qué parte de la web quieres construir primero. Contiene lo decidido hasta la sesión 8 del Proyecto Integrador (Gestión Empresarial de TI 2, Universidad de Caldas, Manizales). Fecha: noviembre de 2026.

## Cómo marcar las cosas

- **[Decidido]**: lo definió el equipo.
- **[Propuesta]**: lo propuso Claude en los entregables y aún no está confirmado.
- **[Hipótesis]**: hay que validarlo con negocios reales.

Regla del proyecto: no inventar datos de mercado y separar siempre hecho, hipótesis y supuesto.

## Instrucciones para el asistente

- Habla en español, directo e informal. Prefiero críticas honestas a validación.
- Antes de escribir código, hazme las preguntas de la sección «Decisiones abiertas» que no estén resueltas.
- Construye por fases pequeñas y dime qué dejaste fuera.
- No inventes testimonios, cifras de clientes nuevos ni datos de mercado en los textos de la web.
- Si algo choca con las reglas de datos (sección 8), avísame antes de implementarlo.

## 1. Qué es At Time

- **Producto [Decidido]:** aplicativo que conecta personas que buscan dónde comer o comprar cerca con pequeños negocios locales de poca visibilidad y poco capital.
- **Problema [Decidido]:** baja visibilidad de los negocios pequeños, que no tienen capital para darse a conocer.
- **Propuesta de valor [Decidido]:** darles visibilidad y facilitar que los usuarios los encuentren, sin que el dueño tenga que crear contenido todos los días ni pagar publicidad costosa.
- **Diferencia buscada [Decidido]:** dar visibilidad a todos los negocios, no solo a las cadenas grandes.
- **Mercado [Decidido]:** de dos lados (negocios que buscan clientes y usuarios que buscan negocios locales).
- **Segmento inicial [Decidido]:** restaurantes pequeños independientes, con piloto en Manizales.
- **Quién paga y decide [Decidido]:** el dueño del negocio. Quien usa el perfil: administrador o empleado.
- **Frase de marca [Propuesta]:** «Lo bueno de tu barrio, a tiempo».
- **Nombre:** At Time es el principal. Existe otro nombre de respaldo, que no se usa en la web.

## 2. Equipo y roles [Decidido]

| Persona | Rol |
|---|---|
| Brayan Stiven Agudelo | Líder de proyecto (coordina y decide) |
| Santiago Soler | Líder técnico (prototipo, datos, automatizaciones) |
| Marco Antonio Agudelo | UX/UI (diseño de interfaz y prototipo) |
| Jose Manuel Osorio | Validación y negocio, y apoyo en otros roles |

Cada rol tiene un respaldo. Son cuatro estudiantes con otras materias: el alcance debe ser pequeño y sostenible.

## 3. Estado de la validación

- **Hipótesis principal [Hipótesis]:** los dueños de restaurantes pequeños de Manizales pagarían una mensualidad baja por At Time si comprueban que su perfil les trae clientes nuevos sin crear contenido.
- **Metas del equipo [Propuesta]:** 15 conversaciones con dueños, 5 negocios en un piloto sin costo y al menos 2 que acepten pagar. Son metas propias, no datos de mercado.
- **Entrevistas:** 2 hechas y 1 en curso. Una validó el problema (crisis de ventas por pocos compradores); otra mostró el problema contrario (exceso de clientes), así que no lo valida.
- **Pendiente:** un diferenciador claro frente a Google Maps e Instagram, y resolver el problema del huevo y la gallina (los negocios necesitan usuarios para ver resultados).

## 4. Qué debería hacer el programa

Funciones descritas para el registro de derechos de autor. **Su estado de implementación hay que confirmarlo.**

1. **Perfiles de negocio:** alta, edición y almacenamiento (nombre, tipo, zona, descripción y contacto).
2. **Verificación:** cada negocio tiene un estado de verificación y solo se publican los verificados.
3. **Búsqueda y consulta:** el usuario busca por tipo y zona y ve el perfil.
4. **Registro de interacciones:** cuenta vistas del perfil y clics en «llamar» o «cómo llegar», de forma agregada y sin guardar datos personales del usuario final.
5. **Reportes:** resumen periódico de interacciones por negocio.
6. **Administración y automatización:** seguimiento de negocios por etapa, tarea automática al inscribirse un negocio y alerta si un perfil pasa 7 días sin interacciones.

### Actores

| Actor | Qué hace |
|---|---|
| Negocio (dueño o administrador) | Crea y edita su perfil, y consulta los reportes. |
| Usuario final | Busca negocios, consulta perfiles, llama o pide indicaciones. |
| Administrador (equipo) | Verifica negocios, publica o suspende perfiles y revisa el seguimiento. |

### Flujo principal

1. El negocio se inscribe y crea su perfil.
2. El administrador verifica que existe.
3. El perfil verificado se publica.
4. El usuario busca y consulta negocios cercanos.
5. El programa registra la interacción de forma agregada.
6. El negocio recibe un reporte periódico.

## 5. Propuesta de arranque para la web [Propuesta]

Hay que confirmar con el equipo qué se construye primero.

- **Fase 1: página de entrada y formulario de inscripción.** Presenta At Time al dueño y convierte con la acción «Inscribe tu restaurante en el piloto». El formulario recoge: nombre del negocio, tipo, zona, nombre y rol del contacto, WhatsApp o correo, y autorización de tratamiento de datos. Cada inscripción crea un lead.
- **Fase 2: perfil del negocio y búsqueda para usuarios.** Perfil público con datos básicos y botones de «llamar» y «cómo llegar»; búsqueda por tipo y zona.
- **Fase 3: panel del negocio y administración.** Reporte de interacciones para el dueño y panel para verificar, publicar y suspender negocios.

### Modelo de datos inicial

- **Negocio:** nombre, tipo, zona, descripción, estado (lead, en verificación, publicado, suspendido).
- **Contacto:** nombre, rol, medio de contacto, autorización de datos y fecha.
- **Verificación:** estado, método y fecha.
- **Interacción (agregada):** negocio, tipo (vista, llamar, cómo llegar) y fecha, sin datos del usuario.
- **Seguimiento (CRM):** etapa, fuente, última fecha de contacto y próxima acción.

### Etapas del CRM

Prospecto → Lead → Oportunidad → Cliente (negocio en piloto) → Retención → Expansión, más el estado «Perdido» con motivo.

## 6. Mensajes y contenido de la web

- **Mensaje principal [Decidido]:** «Que te encuentren los que ya están cerca de tu restaurante, sin crear contenido todos los días».
- **Mensajes de apoyo [Propuesta]:** At Time te da visibilidad sin que tengas que ser experto en redes. Probar el piloto no te cuesta nada: pagas solo si ves resultados.
- **Llamado a la acción [Decidido]:** «Inscribe tu restaurante en el piloto de At Time».
- **No prometer:** cifras de clientes nuevos. Mostrar solo interacciones reales del perfil.
- **Datos que se pueden citar, con fuente:**
  - 95,3 % del tejido empresarial colombiano son mipymes (Suárez, 2025).
  - En Manizales, 91,3 % de las empresas son microempresas, y «alojamiento y servicios de comida» (incluye restaurantes y hoteles) es 12,2 % del total (Cámara de Comercio de Manizales por Caldas, septiembre de 2025).
  - Madurez digital básica: micro 2,09 y medianas 3,01 sobre 5 (Sarmiento Suárez et al., 2024).
- **Tono:** cercano, de barrio, sin tecnicismos. El dueño de un negocio pequeño no es técnico.

## 7. Identidad visual [Decidido para el nombre At Time]

- **Colores:** azul oscuro `#14323F`, naranja `#F26B38`, amarillo `#FFC857`, crema `#FFF4E6`.
- **Tipografía:** Nunito o Poppins (licencia abierta, uso comercial gratuito).
- **Logotipo:** pin de ubicación naranja con un reloj en el centro, más el texto «At Time» (At en azul oscuro, Time en naranja) y la frase de marca. Archivo: `At_Time_identidad_visual.svg` (adjúntalo en el chat nuevo).
- **Estilo:** limpio, esquinas redondeadas, mucho espacio en blanco, móvil primero (hipótesis: los dueños usan sobre todo el celular y WhatsApp).

Logotipo solo (SVG):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="30 10 160 205">
  <path d="M110 20 C70 20 40 52 40 92 C40 140 110 205 110 205 C110 205 180 140 180 92 C180 52 150 20 110 20 Z" fill="#F26B38"/>
  <circle cx="110" cy="92" r="42" fill="#FFF4E6"/>
  <line x1="110" y1="92" x2="110" y2="64" stroke="#14323F" stroke-width="7" stroke-linecap="round"/>
  <line x1="110" y1="92" x2="132" y2="104" stroke="#14323F" stroke-width="7" stroke-linecap="round"/>
  <circle cx="110" cy="92" r="6" fill="#14323F"/>
</svg>
```

## 8. Reglas de datos y calidad [Decidido]

1. Ningún contacto se crea sin fuente, fecha y autorización de tratamiento de datos (Ley 1581 de 2012, Colombia).
2. Un negocio solo se publica después de verificar que existe.
3. Todo registro tiene un responsable y una próxima acción, actualizados en 48 horas.
4. Un solo registro por negocio: revisar duplicados por nombre, barrio y teléfono.
5. Solo el equipo accede a los datos, y se usan únicamente para contactar y mejorar At Time.
6. Si un negocio pide borrar sus datos, se eliminan.
7. Del usuario final solo se miden datos agregados. No se guardan datos personales individuales.
8. No se capturan documentos de identidad ni datos financieros del negocio.

Se necesita una política de tratamiento de datos visible en la web.

## 9. Indicadores que la web debe poder medir

- Clics en el enlace y conversión de visitante a lead.
- Tiempo de primera respuesta a cada lead (meta propuesta: menos de 24 horas).
- Tasa de activación: negocios con al menos una interacción en sus primeros 7 días (meta propuesta: 60 %).
- Interacciones por negocio por semana.
- Retención o aceptación de pago al cerrar el piloto.

## 10. Decisiones abiertas

Pregúntame esto antes de escribir código, porque no están definidas:

1. **Alcance:** ¿empezamos por la página de entrada con formulario, por el perfil y la búsqueda, o por todo?
2. **Tecnología:** lenguaje, framework, base de datos y alojamiento. Los decide el líder técnico; todavía no están definidos para At Time.
3. **Tipo de aplicación:** ¿solo web adaptable a celular o también aplicación móvil?
4. **Cómo se verifica un negocio** (visita, enlace a su perfil en Google, documento) y quién lo hace.
5. **Pagos:** en esta etapa el piloto no cuesta; no hay pasarela de pagos prevista.
6. **Quién diseña las pantallas:** Marco (UX/UI), y cómo se pasan los diseños al líder técnico.
7. **Dominio y alojamiento:** si hay presupuesto o se usa una opción gratuita.
8. **Idioma de la web:** español de Colombia.

## 11. Lo que NO está decidido ni debe asumirse

- No hay stack técnico definido para At Time.
- No hay cuenta de empresa ni persona jurídica.
- No se ha hecho ninguna venta ni hay negocios pagando.
- El diferenciador frente a Google Maps e Instagram aún no está consolidado.
- Existen metas numéricas, pero son del equipo y no datos de mercado.

## 12. Documentos del proyecto (para pedirlos si hacen falta)

Sesión 3: Diseño conceptual de CRM v1. Sesión 4: Estrategia Digital v1. Sesión 5: guía de habilidades gerenciales y protocolo de decisiones. Sesión 6: Estructura mínima viable y perfiles de rol v1. Sesión 7: Ciclo de talento humano y tablero de indicadores v1. Sesión 8: Análisis de oportunidad de contratación estatal v1. Además: Descripción del programa (para registro de derechos de autor) y la identidad visual.