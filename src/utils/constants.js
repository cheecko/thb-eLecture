export const ELECTURE_THB_DOMAIN = 'https://electures.th-brandenburg.de'

export const PREFIXES = `
    @prefix schema: <https://schema.org/> .
    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
    @prefix vidp: <https://bmake.th-brandenburg.de/vidp/> .
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
    @prefix wd: <http://www.wikidata.org/entity/> .
    @prefix vide: <https://bmake.th-brandenburg.de/vide/> .
    @prefix module: <https://bmake.th-brandenburg.de/module/> .
    @prefix thb-fbwm: <https://www.th-brandenburg.de/mitarbeiterseiten/fbw/> .
    @prefix thb-fbim: <https://www.th-brandenburg.de/mitarbeiterseiten/fbi/> .
    @prefix thb-fbtm: <https://www.th-brandenburg.de/mitarbeiterseiten/fbt/> .

    
`

export const FIELD_INFOS = {
    addLectures: {
        abbreviation: 'Besteht idealerweise aus 4 Zeichen und dient als Erkennungsmerkmal für die Lecture',
        language: 'Sprache in der das Video aufgenommen wurde',
        provider: 'Provider ist derzeit Vimeo',
        playerType: 'Single – ohne Sprecher, Stimme mit Präsentation, Double – Video vom Sprecher + Video Präsentation',
        vimeoID: 'Vimeo-ID ist im Link des hochgeladenen Videos angegeben'
    }
}

export const StudyProgram = [
    {
        id: 'module:BMZK',
        label: 'Bachelor Medizininformatik',
        name: {
            de: 'Bachelor Medizininformatik',
            en: 'Bachelor Medical Informatics'
        },
        accountablePerson: 'thb-fbim:eberhard-beck',
        provider: 'module:THB_FBI',
        url: 'https://informatik.th-brandenburg.de/studium/bachelorstudiengaenge/medizininformatik/'
    },
    {
        id: 'module:BIFK',
        label: 'Bachelor Informatik',
        name: {
            de: 'Bachelor Informatik',
            en: 'Bachelor Computer Science'
        },
        accountablePerson: 'thb-fbim:martin-schaffoener',
        provider: 'module:THB_FBI',
        url: 'https://informatik.th-brandenburg.de/studium/bachelorstudiengaenge/informatik/'
    },
    {
        id: 'module:BACS',
        label: 'Bachelor Applied Computer Science',
        name: {
            de: 'Bachelor Applied Computer Science',
            en: 'Bachelor Applied Computer Science'
        },
        accountablePerson: 'thb-fbim:martin-schaffoener',
        provider: 'module:THB_FBI',
        url: 'https://informatik.th-brandenburg.de/studium/bachelorstudiengaenge/applied-computer-science/'
    }
]

export const Courses = [
    {
        id: 'module:MIK3',
        label: 'Mathematik III',
        name: {
            de: 'Mathematik III',
            en: 'Mathematics III'
        },
        accountablePerson: 'thb-fbim:rolf-socher',
        provider: 'module:THB_FBI',
        url: '',
        isPartOf: ['module:BIFK', 'module:BACS']
    }
]

export const Person = [
    {
        id: 'thb-fbim:martin-schaffoener',
        label: 'Prof. Dr.-Ing. Martin Schafföner',
        name: 'Martin Schafföner',
        givenName: 'Martin',
        familyName: 'Schafföner',
        email: 'martin.schaffoener@th-brandenburg.de',
        affiliation: 'wd:Q1391182',
        url: 'https://www.th-brandenburg.de/mitarbeiterseiten/fbi/martin-schaffoener/'
    },
    {
        id: 'thb-fbim:eberhard-beck',
        label: 'Prof. Dr. Eberhard Beck',
        name: 'Eberhard Beck',
        givenName: 'Eberhard',
        familyName: 'Beck',
        email: 'eberhard.beck@th-brandenburg.de',
        affiliation: 'wd:Q1391182',
        url: 'https://www.th-brandenburg.de/mitarbeiterseiten/fbi/eberhard-beck/'
    },
    {
        id: 'thb-fbim:rolf-socher',
        label: 'Prof. Dr. Rolf Socher',
        name: 'Rolf Socher',
        givenName: 'Rolf',
        familyName: 'Socher',
        email: 'rolf.socher@th-brandenburg.de',
        affiliation: 'wd:Q1391182',
        url: 'https://www.th-brandenburg.de/mitarbeiterseiten/fbi/rolf-socher/'
    },
    {
        id: 'thb-fbwm:vera-meister',
        label: 'Prof. Dr. Vera G. Meister',
        name: 'Vera G. Meister',
        givenName: 'Vera G.',
        familyName: 'Meister',
        email: 'vera.meister@th-brandenburg.de',
        affiliation: 'wd:Q1391182',
        url: 'https://www.th-brandenburg.de/mitarbeiterseiten/fbw/vera-meister/'
    }
]

export const VideoLecture = [
    {
        id: 'vide:BedW',
        label: 'BedW',
        name: 'BedW',
        headline: {
            de: 'Bedingte Wahrscheinlichkeiten',
            en: 'Conditional probabilities'
        },
        inLanguage: 'de',
        thumbnail: 'vide:Stoch_thn',
        keywords: {
            de: 'bedingte Wahrscheinlichkeit, stochastische Unabhängigkeit, totale Wahrscheinlichkeit, Satz von Bayes, Vierfeldertafel',
            en: 'conditional probability, stochastic independence, total probability, Bayes\' theorem, Four-field chart'
        },
        description: {
            de: 'Die Videovorlesung widmet sich dem Thema der bedingten Wahrscheinlichkeiten. Anhand anschaulicher Anwendungsfälle werden Definitionen, Formeln und daraus ableitbare Theoreme für Zufallsereignisse dargestellt und schließlich auf Zufallsgrößen verallgemeinert. Das Wissen um bedingte Wahrscheinlichkeiten ist grundlegend, um stochastische Zusammenhänge in Wirtschaft, Gesellschaft und Wissenschaft zu verstehen. Aktuell von großer Relevanz sind Anwendungsfälle im Kontext medizinischer Tests.',
            en: 'The video lecture is dedicated to the topic of conditional probabilities. On the basis of illustrative application cases, definitions, formulas and derivable theorems for random events are presented and finally generalized to random variables. The knowledge of conditional probabilities is fundamental to understand stochastic relations in economy, society and science. Currently of great relevance are applications in the context of medical testing.'
        },
        licence: 'https://creativecommons.org/licenses/by-nc-sa/2.0/de/',
        about: ['module:MIK3', 'module:MIKM']
    },
    {
        id: 'vide:SVKE',
        label: 'SVKE',
        name: 'SVKE',
        headline: {
            de: 'Standards und Vokabulare für die technische Wissensmodellierung',
            en: 'Standards and Vocabularies for Knowledge Engineering'
        },
        inLanguage: 'en',
        thumbnail: 'vide:MMI_thn',
        keywords: {
            de: 'SKOS , Skosmos Browser , RDFS , schema.org , OWL 2',
            en: 'SKOS , Skosmos Browser , RDFS , schema.org , OWL 2'
        },
        description: {
            de: 'Im Zentrum dieser Vorlesung stehen drei essenzielle W3C-Standards für die Technische Wissensmodellierung: SKOS, RDFS und OWL 2. Die formalen und definitorischen Aspekte dieser Spezifikationen werden systematisch eingeführt und erläutert. Anwendungsfälle demonstrieren die jeweiligen Einsatzgebiete. So liegt der Fokus von SKOS auf der Modellierung von Thesauri. RDFS in Verbindung mit schema.org erlaubt die Entwicklung komplexer Faktennetz-Strukturen. Hier wird der gesamte Weg von der Analyse der Domäne bis zur Entwicklung und Pflege einer Wissensanwendung gezeigt. Der Einsatz von OWL 2 zur Modellierung reicher Ontologien wird nur angedeutet.',
            en: 'This lecture focuses on three essential W3C standards for knowledge engineering: SKOS, RDFS and OWL 2. The formal and conceptual aspects of these specifications are systematically introduced and explained. Use cases demonstrate the respective areas of application. So the focus of SKOS is on the modeling of thesauri. RDFS in combination with schema.org allows the development of complex fact net structures. In this case, the entire path from the analysis of the domain to the development and maintenance of a knowledge application is shown. The use of OWL 2 for modeling rich ontologies is only touched upon.'
        },
        licence: 'https://creativecommons.org/licenses/by-nc-sa/2.0/de/',
        about: ['module:WM524']
    },
    {
        id: 'vide:BITG',
        label: 'BITG',
        name: 'BITG',
        headline: {
            de: 'Body of Knowledge für IT-Konzepte',
            en: 'Body of Knowledge for IT Governance'
        },
        inLanguage: 'en',
        thumbnail: 'vide:MMI_thn',
        keywords: {
            de: 'Body of Knowledge , IT Governance , Knowledge Graph , Knowledge Schema , Samples and Templates',
            en: 'Body of Knowledge , IT-Governance , Wissensgraph , Wissensschema , Vorlagen und Muster'
        },
        description: {
            de: 'In diesem Vortrag auf dem Leipziger Semantic Web Tag 2021 wird über ein Kooperationsprojekt der Hochschulen des Landes Brandenburg berichtet. Ziel des Projektes ist es, ein gemeinsames Portfolio an Mustern und Vorlagen für IT-Konzepte zu entwickeln, das sich auf die Struktur eines Wissensgraphen stützt.',
            en: 'This talk at the Leipzig Semantic Web Day 2021 will report on a collaborative project between universities in the state of Brandenburg. The goal of the project is to develop a common portfolio of samples and templates for IT governance concepts based on the structure of a knowledge graph.'
        },
        licence: 'https://creativecommons.org/licenses/by-nc-sa/2.0/de/',
        about: ['module:WM524']
    }
]

export const ImageObject = [
    {
        id: 'vide:Stoch_thn',
        name: 'stochastik.png',
        url: 'https://drive.google.com/open?id=1v2WMVI5O7BzUEqSkJFA0ZKJYGxj1otF_',
        identifier: '1v2WMVI5O7BzUEqSkJFA0ZKJYGxj1otF_'
    }
]

export const VideoObject = [
    {
        id: 'vide:BedW_00',
        label: 'BedW Clip 00',
        isPartOf: 'vide:BedW',
        name: 'BedW Clip 00',
        headline: 'Die bedingte Wahrscheinlichkeit',
        creator: 'thb-fbim:rolf-socher',
        dateCreated: '2020-11-12',
        duration: 'PT05M24S',
        encodingFormat: 'mp4',
        playerType: 'single',
        maintainer: 'wd:Q156376',
        additionalProperty: [
            {
                name: 'podcast',
                propertyID: '478608009'
            }
        ]
    },
    {
        id: 'vide:BedW_01',
        label: 'BedW Clip 01',
        isPartOf: 'vide:BedW',
        name: 'BedW Clip 01',
        headline: 'Stochastische Unabhängigkeit',
        creator: 'thb-fbim:rolf-socher',
        dateCreated: '2020-11-12',
        duration: 'PT10M41S',
        encodingFormat: 'mp4',
        playerType: 'single',
        maintainer: 'wd:Q156376',
        additionalProperty: [
            {
                name: 'podcast',
                propertyID: '478671815'
            }
        ]
    },
    {
        id: 'vide:BedW_02',
        label: 'BedW Clip 02',
        isPartOf: 'vide:BedW',
        name: 'BedW Clip 02',
        headline: 'Die totale Wahrscheinlichkeit',
        creator: 'thb-fbim:rolf-socher',
        dateCreated: '2020-11-12',
        duration: 'PT06M08S',
        encodingFormat: 'mp4',
        playerType: 'single',
        maintainer: 'wd:Q156376',
        additionalProperty: [
            {
                name: 'podcast',
                propertyID: '478672085'
            }
        ]
    },
    {
        id: 'vide:BedW_03',
        label: 'BedW Clip 03',
        isPartOf: 'vide:BedW',
        name: 'BedW Clip 03',
        headline: 'Der Satz von Bayes',
        creator: 'thb-fbim:rolf-socher',
        dateCreated: '2020-11-12',
        duration: 'PT12M44S',
        encodingFormat: 'mp4',
        playerType: 'single',
        maintainer: 'wd:Q156376',
        additionalProperty: [
            {
                name: 'podcast',
                propertyID: '478672194'
            }
        ]
    },
    {
        id: 'vide:BITG_00',
        label: 'BITG Clip 00',
        isPartOf: 'vide:BITG',
        name: 'BITG Clip 00',
        headline: 'Conference Talk',
        creator: 'thb-fbwm:vera-meister',
        dateCreated: '2021-07-06',
        duration: 'PT11M10S',
        encodingFormat: 'mp4',
        playerType: 'single',
        maintainer: 'wd:Q156376',
        additionalProperty: [
            {
                name: 'podcast',
                propertyID: '572674408'
            }
        ]
    },
    {
        id: 'vide:SVKE_00',
        label: 'SVKE Clip 00',
        isPartOf: 'vide:SVKE',
        name: 'SVKE Clip 00',
        headline: 'Standards and Vocabularies and the Semantic Web Stack',
        creator: 'thb-fbwm:vera-meister',
        dateCreated: '2022-04-01',
        duration: 'PT04M24S',
        encodingFormat: 'mp4',
        playerType: 'double',
        maintainer: 'wd:Q156376',
        additionalProperty: [
            {
                name: 'lecturer',
                propertyID: '695397756'
            },
            {
                name: 'screencast',
                propertyID: '695397693'
            }
        ]
    },
    {
        id: 'vide:SVKE_01',
        label: 'SVKE Clip 01',
        isPartOf: 'vide:SVKE',
        name: 'SVKE Clip 01',
        headline: 'SKOS Sources, Base Structure and Application Case',
        creator: 'thb-fbwm:vera-meister',
        dateCreated: '2022-04-01',
        duration: 'PT11M22S',
        encodingFormat: 'mp4',
        playerType: 'double',
        maintainer: 'wd:Q156376',
        additionalProperty: [
            {
                name: 'lecturer',
                propertyID: '695390200'
            },
            {
                name: 'screencast',
                propertyID: '695390043'
            }
        ]
    }
]