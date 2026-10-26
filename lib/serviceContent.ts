import { pick } from "./data";
const descriptions: Record<string, [string, string, string]> = {
  consultation: [
    "Un temps d’échange avec le praticien pour faire le point sur vos attentes, examiner votre situation et discuter des prochaines étapes.",
    "Time with the practitioner to discuss your expectations, assess your situation and consider the next steps.",
    "لقاء مع الطبيب لمناقشة توقعاتكم وتقييم حالتكم وبحث الخطوات التالية.",
  ],
  cleaning: [
    "Un rendez-vous consacré au nettoyage professionnel et à la discussion de vos habitudes d’hygiène bucco-dentaire. Le praticien adapte le soin après examen.",
    "A visit focused on professional cleaning and a discussion of your oral hygiene routine. Care is adapted following an examination.",
    "زيارة مخصصة للتنظيف المهني ومناقشة عادات نظافة الفم. يتم تكييف العناية بعد الفحص.",
  ],
  whitening: [
    "Une consultation pour discuter de la teinte de vos dents, de vos attentes esthétiques et des possibilités appropriées après examen.",
    "A consultation to discuss tooth shade, your aesthetic expectations and appropriate options following an examination.",
    "استشارة لمناقشة لون الأسنان وتوقعاتكم الجمالية والخيارات المناسبة بعد الفحص.",
  ],
  orthodontics: [
    "Un échange autour de l’alignement dentaire et de l’occlusion. Une évaluation est nécessaire pour déterminer les options et le suivi éventuel.",
    "A discussion about tooth alignment and bite. An assessment is needed to determine possible options and follow-up.",
    "مناقشة اصطفاف الأسنان والإطباق. يلزم تقييم لتحديد الخيارات والمتابعة المحتملة.",
  ],
  veneers: [
    "Une consultation dédiée à votre projet esthétique, à la forme et à l’apparence des dents. Le praticien explique les possibilités, les limites et les alternatives.",
    "A consultation about your aesthetic goals and the shape and appearance of your teeth. The practitioner explains options, limitations and alternatives.",
    "استشارة حول أهدافكم الجمالية وشكل الأسنان ومظهرها. يشرح الطبيب الخيارات والحدود والبدائل.",
  ],
  implants: [
    "Une évaluation personnalisée des possibilités de remplacement dentaire. Le bilan, les étapes et les alternatives sont discutés avant toute décision.",
    "An individual assessment of tooth replacement options. Assessment, stages and alternatives are discussed before any decision.",
    "تقييم فردي لخيارات تعويض الأسنان. تتم مناقشة الفحوصات والمراحل والبدائل قبل أي قرار.",
  ],
  cavities: [
    "Un examen pour évaluer une dent et discuter des soins adaptés. Chaque proposition est expliquée selon la situation observée lors de la consultation.",
    "An examination to assess a tooth and discuss appropriate care. Each proposal is explained based on the findings of the consultation.",
    "فحص لتقييم السن ومناقشة العناية المناسبة. يتم شرح كل مقترح وفق نتائج الاستشارة.",
  ],
  endodontics: [
    "Une consultation pour évaluer les tissus internes d’une dent et discuter de la prise en charge possible, de ses étapes et de son suivi.",
    "A consultation to assess the internal tissues of a tooth and discuss possible care, treatment stages and follow-up.",
    "استشارة لتقييم الأنسجة الداخلية للسن ومناقشة الرعاية الممكنة ومراحلها ومتابعتها.",
  ],
  surgery: [
    "Une consultation préalable pour examiner votre situation et expliquer l’intervention envisagée, les alternatives et les informations nécessaires à votre décision.",
    "A prior consultation to assess your situation and explain the proposed procedure, alternatives and information needed for your decision.",
    "استشارة أولية لتقييم الحالة وشرح التدخل المقترح والبدائل والمعلومات اللازمة لاتخاذ القرار.",
  ],
  prosthetics: [
    "Un échange sur les solutions de remplacement dentaire, fixes ou amovibles. Les choix sont étudiés avec le praticien selon votre situation.",
    "A discussion of fixed or removable tooth replacement options. Choices are considered with the practitioner according to your situation.",
    "مناقشة خيارات تعويض الأسنان الثابتة أو المتحركة. تُدرس الخيارات مع الطبيب وفق حالتكم.",
  ],
  aesthetics: [
    "Un temps d’écoute pour comprendre vos attentes concernant votre sourire et discuter d’un projet adapté, sans promesse de résultat.",
    "Time to understand your expectations for your smile and discuss a suitable plan, without promising a particular outcome.",
    "وقت لفهم توقعاتكم بشأن ابتسامتكم ومناقشة خطة مناسبة دون وعود بنتائج محددة.",
  ],
  emergency: [
    "Une demande de consultation pour un besoin dentaire imprévu. Ce parcours de démonstration n’est pas un dispositif d’urgence et n’envoie aucune alerte.",
    "A consultation request for an unexpected dental concern. This demonstration flow is not an emergency service and sends no alerts.",
    "طلب استشارة لمشكلة أسنان غير متوقعة. هذه التجربة ليست خدمة طوارئ ولا ترسل تنبيهات.",
  ],
};
export function serviceDescription(slug: string, l: string) {
  const v = descriptions[slug] || descriptions.consultation;
  return pick(l, ...v);
}
