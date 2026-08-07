export interface InfluencerConcept {
  phrase: string;
  source: string;
}

// No se incluyen citas textuales atribuidas a personas reales que no se
// pudieron verificar contra una fuente primaria. Esto es un concepto/mantra
// inspirado en su marca personal, no una cita verbatim.
export const INFLUENCER_CONCEPTS: InfluencerConcept[] = [
  {
    phrase: 'Modo Guerra: hoy elijo disciplina, enfoque y no depender de nadie más para sentirme bien.',
    source: 'Inspirado en "Modo Guerra", concepto de El Temach (Luis Castilleja)',
  },
];
