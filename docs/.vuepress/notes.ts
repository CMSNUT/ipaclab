import { definePlumeNotesConfig } from 'vuepress-theme-plume'

export const zhNotes = definePlumeNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [
    {
      dir: 'lab-guide/doe/',
      link: '/doe/',
      sidebar: 'auto',
    },
    {
      dir: 'lab-guide/instruments/',
      link: '/instruments/',
      sidebar: 'auto',
    },
    {
      dir: 'chemometrics/pretreatment/',
      link: '/pretreatment/',
      sidebar: 'auto',
    },
    {
      dir: 'chemometrics/multivariate-calibration/',
      link: '/multivariate-calibration/',
      sidebar: 'auto',
    },
    {
      dir: 'chemometrics/multivariate-resolution/',
      link: '/multivariate-resolution/',
      sidebar: 'auto',
    },
    {
      dir: 'chemometrics/pattern-recognition/',
      link: '/pattern-recognition/',
      sidebar: 'auto',
    },
    {
      dir: 'bioinformatics/datasets/',
      link: '/datasets/',
      sidebar: 'auto',
    },
    {
      dir: 'bioinformatics/primer/',
      link: '/primer/',
      sidebar: 'auto',
    },
    {
      dir: 'machine-learning/cml/',
      link: '/cml/',
      sidebar: 'auto',
    },
    {
      dir: 'machine-learning/dl/',
      link: '/dl/',
      sidebar: 'auto',
    },
    {
      dir: 'projects/',
      link: '/projects/',
      sidebar: 'auto',
    },
  ],
})

export const enNotes = definePlumeNotesConfig({
  dir: 'en/notes',
  link: '/',
  notes: [],
})
