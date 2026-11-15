/**
 * Curated scientific references shown alongside selected exploration sites.
 *
 * These are source links and educational metadata only. The current 3D terrain
 * remains procedural; no elevation raster or imagery is loaded by this module.
 */
export interface ScientificResource {
  title: string;
  provider: string;
  dataType: string;
  description: string;
  url: string;
  usageNote: string;
}

export const SCIENTIFIC_RESOURCES_BY_SITE: Record<string, ScientificResource[]> = {
  'moon-shackleton-rim': [
    {
      title: 'High-Resolution LOLA Topography — Site 04 (Shackleton Rim)',
      provider: 'NASA Goddard Space Flight Center · Planetary Geodesy and Geophysics Laboratory',
      dataType: 'LRO laser-altimeter elevation products',
      description:
        'The Site 04 collection includes 5-metre-per-pixel lunar elevation products for the Shackleton rim region, plus related slope and uncertainty products.',
      url: 'https://pgda.gsfc.nasa.gov/products/78',
      usageNote:
        'Linked as a scientific reference. These files are not loaded into or used to generate the game terrain.',
    },
    {
      title: 'NASA Moon Kit',
      provider: 'NASA Scientific Visualization Studio',
      dataType: 'Educational visualization resource',
      description:
        'NASA visualizations and learning material that help explain the Moon and lunar exploration.',
      url: 'https://svs.gsfc.nasa.gov/4720/',
      usageNote: 'Reference material only; it is not a game texture or terrain asset.',
    },
  ],
  'mars-jezero-delta': [
    {
      title: 'Mars 2020 — Jezero HiRISE Terrain Products',
      provider: 'Bruce Murray Laboratory for Planetary Visualization · Caltech',
      dataType: 'HiRISE imagery-derived terrain and elevation products',
      description:
        'The laboratory publishes high-resolution terrain products derived from HiRISE imagery. Its Mars 2020 work supported evaluation and planning for the Jezero landing region.',
      url: 'https://murray-lab.caltech.edu/Mars2020/index.html',
      usageNote:
        'Linked as a scientific reference. No large DEM download is bundled with the game or used to generate its terrain.',
    },
  ],
};
