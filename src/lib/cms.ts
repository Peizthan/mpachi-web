export type GalleryItem = {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  alt: string;
};

export type EducationalResource = {
  id: string;
  title: string;
  summary: string;
  type: "article" | "video" | "guide" | "ejercicio";
  publishedAt: string;
  url: string;
};

// TODO: reemplazar stubs con consultas reales al CMS elegido (e.g. Sanity).
export async function getGalleryItems(): Promise<GalleryItem[]> {
  return [
    {
      id: "being-taller-1",
      title: "Taller de regulación emocional",
      description: "Sesión grupal con familias en Santiago",
      imageUrl: "https://dummyimage.com/640x480/163c4d/ffffff&text=Taller+BEING",
      alt: "Familias participando en un taller guiado por María Paz Jiménez",
    },
    {
      id: "being-charla-1",
      title: "Charla corporativa BEING",
      description: "Entrenamiento en habilidades socioemocionales",
      imageUrl: "https://dummyimage.com/640x480/25636f/ffffff&text=Charla+BEING",
      alt: "María Paz exponiendo en un escenario frente a un auditorio",
    },
  ];
}

export async function getEducationalResources(): Promise<EducationalResource[]> {
  return [
    {
      id: "ansiedad-adolescentes",
      title: "Estrategias para acompañar la ansiedad en adolescentes",
      summary: "Artículo con recomendaciones prácticas y ejercicios de regulación.",
      type: "article",
      publishedAt: "2025-07-12",
      url: "/recursos/ansiedad-adolescentes",
    },
    {
      id: "respiracion-consciente",
      title: "Serie de respiración consciente",
      summary: "Videos cortos para incorporar a la rutina diaria.",
      type: "video",
      publishedAt: "2025-08-05",
      url: "/recursos/respiracion",
    },
  ];
}
