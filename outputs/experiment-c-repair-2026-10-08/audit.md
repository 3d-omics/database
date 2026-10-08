# BioSamples repair audit

CSV: /Users/anttonalberdi/Github/arch3d/examples/experiment_c_proposal.csv
No writes were made.

## SAMEA120503842
Name: C001aK -> C001
Level: [{'text': 'macrosample'}] -> [{'text': 'specimen'}]
Parent: ['SAMEA120503842'] -> []
Incoming links (read-only): [{'source': 'SAMEA120503854', 'type': 'derived from', 'target': 'SAMEA120503842'}, {'source': 'SAMEA120503855', 'type': 'derived from', 'target': 'SAMEA120503842'}]
Structured data: unchanged
```json
{
  "characteristics": {
    "before": {
      "SRA accession": [
        {
          "text": "ERS27204529"
        }
      ],
      "level": [
        {
          "text": "macrosample"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    },
    "after": {
      "SRA accession": [
        {
          "text": "ERS27204529"
        }
      ],
      "level": [
        {
          "text": "specimen"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    }
  },
  "name": {
    "before": "C001aK",
    "after": "C001"
  },
  "relationships": {
    "before": [
      {
        "source": "SAMEA120503842",
        "type": "derived from",
        "target": "SAMEA120503842"
      }
    ],
    "after": []
  }
}
```
Structured-data diff:
```json
{
  "before": {
    "accession": "SAMEA120503842",
    "create": "2025-11-07T04:19:34.615Z",
    "update": "2025-11-12T09:29:38.185Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          },
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC1",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet+EarlyMannan",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "17.6",
              "iri": null
            }
          }
        ]
      }
    ]
  },
  "after": {
    "accession": "SAMEA120503842",
    "create": "2025-11-07T04:19:34.615Z",
    "update": "2025-11-12T09:29:38.185Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          },
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC1",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet+EarlyMannan",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "17.6",
              "iri": null
            }
          }
        ]
      }
    ]
  }
}
```

## SAMEA120503843
Name: C002aK -> C002
Level: [{'text': 'macrosample'}] -> [{'text': 'specimen'}]
Parent: ['SAMEA120503843'] -> []
Incoming links (read-only): [{'source': 'SAMEA120503856', 'type': 'derived from', 'target': 'SAMEA120503843'}, {'source': 'SAMEA120503857', 'type': 'derived from', 'target': 'SAMEA120503843'}]
Structured data: unchanged
```json
{
  "characteristics": {
    "before": {
      "SRA accession": [
        {
          "text": "ERS27204530"
        }
      ],
      "level": [
        {
          "text": "macrosample"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    },
    "after": {
      "SRA accession": [
        {
          "text": "ERS27204530"
        }
      ],
      "level": [
        {
          "text": "specimen"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    }
  },
  "name": {
    "before": "C002aK",
    "after": "C002"
  },
  "relationships": {
    "before": [
      {
        "source": "SAMEA120503843",
        "type": "derived from",
        "target": "SAMEA120503843"
      }
    ],
    "after": []
  }
}
```
Structured-data diff:
```json
{
  "before": {
    "accession": "SAMEA120503843",
    "create": "2025-11-07T04:19:35.462Z",
    "update": "2025-11-12T09:29:39.051Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          },
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC1",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet+EarlyMannan",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "14.6",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          }
        ]
      }
    ]
  },
  "after": {
    "accession": "SAMEA120503843",
    "create": "2025-11-07T04:19:35.462Z",
    "update": "2025-11-12T09:29:39.051Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          },
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC1",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet+EarlyMannan",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "14.6",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          }
        ]
      }
    ]
  }
}
```

## SAMEA120503844
Name: C003aK -> C003
Level: [{'text': 'macrosample'}] -> [{'text': 'specimen'}]
Parent: ['SAMEA120503844'] -> []
Incoming links (read-only): [{'source': 'SAMEA120503858', 'type': 'derived from', 'target': 'SAMEA120503844'}, {'source': 'SAMEA120503859', 'type': 'derived from', 'target': 'SAMEA120503844'}]
Structured data: unchanged
```json
{
  "characteristics": {
    "before": {
      "SRA accession": [
        {
          "text": "ERS27204531"
        }
      ],
      "level": [
        {
          "text": "macrosample"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    },
    "after": {
      "SRA accession": [
        {
          "text": "ERS27204531"
        }
      ],
      "level": [
        {
          "text": "specimen"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    }
  },
  "name": {
    "before": "C003aK",
    "after": "C003"
  },
  "relationships": {
    "before": [
      {
        "source": "SAMEA120503844",
        "type": "derived from",
        "target": "SAMEA120503844"
      }
    ],
    "after": []
  }
}
```
Structured-data diff:
```json
{
  "before": {
    "accession": "SAMEA120503844",
    "create": "2025-11-07T04:19:36.452Z",
    "update": "2025-11-12T09:29:39.848Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC1",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet+EarlyMannan",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "15.2",
              "iri": null
            }
          }
        ]
      }
    ]
  },
  "after": {
    "accession": "SAMEA120503844",
    "create": "2025-11-07T04:19:36.452Z",
    "update": "2025-11-12T09:29:39.848Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC1",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet+EarlyMannan",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "15.2",
              "iri": null
            }
          }
        ]
      }
    ]
  }
}
```

## SAMEA120503845
Name: C004aK -> C004
Level: [{'text': 'macrosample'}] -> [{'text': 'specimen'}]
Parent: ['SAMEA120503845'] -> []
Incoming links (read-only): [{'source': 'SAMEA120503860', 'type': 'derived from', 'target': 'SAMEA120503845'}, {'source': 'SAMEA120503861', 'type': 'derived from', 'target': 'SAMEA120503845'}]
Structured data: unchanged
```json
{
  "characteristics": {
    "before": {
      "SRA accession": [
        {
          "text": "ERS27204532"
        }
      ],
      "level": [
        {
          "text": "macrosample"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    },
    "after": {
      "SRA accession": [
        {
          "text": "ERS27204532"
        }
      ],
      "level": [
        {
          "text": "specimen"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    }
  },
  "name": {
    "before": "C004aK",
    "after": "C004"
  },
  "relationships": {
    "before": [
      {
        "source": "SAMEA120503845",
        "type": "derived from",
        "target": "SAMEA120503845"
      }
    ],
    "after": []
  }
}
```
Structured-data diff:
```json
{
  "before": {
    "accession": "SAMEA120503845",
    "create": "2025-11-07T04:19:37.351Z",
    "update": "2025-11-12T09:29:41.080Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          },
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet+LateMannan",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC2",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "17.5",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          }
        ]
      }
    ]
  },
  "after": {
    "accession": "SAMEA120503845",
    "create": "2025-11-07T04:19:37.351Z",
    "update": "2025-11-12T09:29:41.080Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          },
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet+LateMannan",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC2",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "17.5",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          }
        ]
      }
    ]
  }
}
```

## SAMEA120503846
Name: C005aK -> C005
Level: [{'text': 'macrosample'}] -> [{'text': 'specimen'}]
Parent: ['SAMEA120503846'] -> []
Incoming links (read-only): [{'source': 'SAMEA120503862', 'type': 'derived from', 'target': 'SAMEA120503846'}, {'source': 'SAMEA120503863', 'type': 'derived from', 'target': 'SAMEA120503846'}]
Structured data: unchanged
```json
{
  "characteristics": {
    "before": {
      "SRA accession": [
        {
          "text": "ERS27204533"
        }
      ],
      "level": [
        {
          "text": "macrosample"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    },
    "after": {
      "SRA accession": [
        {
          "text": "ERS27204533"
        }
      ],
      "level": [
        {
          "text": "specimen"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    }
  },
  "name": {
    "before": "C005aK",
    "after": "C005"
  },
  "relationships": {
    "before": [
      {
        "source": "SAMEA120503846",
        "type": "derived from",
        "target": "SAMEA120503846"
      }
    ],
    "after": []
  }
}
```
Structured-data diff:
```json
{
  "before": {
    "accession": "SAMEA120503846",
    "create": "2025-11-07T04:19:38.198Z",
    "update": "2025-11-12T09:29:41.868Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          },
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet+LateMannan",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC2",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "16.3",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          }
        ]
      }
    ]
  },
  "after": {
    "accession": "SAMEA120503846",
    "create": "2025-11-07T04:19:38.198Z",
    "update": "2025-11-12T09:29:41.868Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          },
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet+LateMannan",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC2",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "16.3",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          }
        ]
      }
    ]
  }
}
```

## SAMEA120503847
Name: C006aK -> C006
Level: [{'text': 'macrosample'}] -> [{'text': 'specimen'}]
Parent: ['SAMEA120503847'] -> []
Incoming links (read-only): [{'source': 'SAMEA120503864', 'type': 'derived from', 'target': 'SAMEA120503847'}, {'source': 'SAMEA120503865', 'type': 'derived from', 'target': 'SAMEA120503847'}]
Structured data: unchanged
```json
{
  "characteristics": {
    "before": {
      "SRA accession": [
        {
          "text": "ERS27204534"
        }
      ],
      "level": [
        {
          "text": "macrosample"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    },
    "after": {
      "SRA accession": [
        {
          "text": "ERS27204534"
        }
      ],
      "level": [
        {
          "text": "specimen"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    }
  },
  "name": {
    "before": "C006aK",
    "after": "C006"
  },
  "relationships": {
    "before": [
      {
        "source": "SAMEA120503847",
        "type": "derived from",
        "target": "SAMEA120503847"
      }
    ],
    "after": []
  }
}
```
Structured-data diff:
```json
{
  "before": {
    "accession": "SAMEA120503847",
    "create": "2025-11-07T04:19:39.085Z",
    "update": "2025-11-12T09:29:42.685Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          },
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          },
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC2",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet+LateMannan",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "18.3",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          }
        ]
      }
    ]
  },
  "after": {
    "accession": "SAMEA120503847",
    "create": "2025-11-07T04:19:39.085Z",
    "update": "2025-11-12T09:29:42.685Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          },
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          },
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC2",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet+LateMannan",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "18.3",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          }
        ]
      }
    ]
  }
}
```

## SAMEA120503848
Name: C007aK -> C007
Level: [{'text': 'macrosample'}] -> [{'text': 'specimen'}]
Parent: ['SAMEA120503848'] -> []
Incoming links (read-only): [{'source': 'SAMEA120503866', 'type': 'derived from', 'target': 'SAMEA120503848'}, {'source': 'SAMEA120503867', 'type': 'derived from', 'target': 'SAMEA120503848'}]
Structured data: unchanged
```json
{
  "characteristics": {
    "before": {
      "SRA accession": [
        {
          "text": "ERS27204535"
        }
      ],
      "level": [
        {
          "text": "macrosample"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    },
    "after": {
      "SRA accession": [
        {
          "text": "ERS27204535"
        }
      ],
      "level": [
        {
          "text": "specimen"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    }
  },
  "name": {
    "before": "C007aK",
    "after": "C007"
  },
  "relationships": {
    "before": [
      {
        "source": "SAMEA120503848",
        "type": "derived from",
        "target": "SAMEA120503848"
      }
    ],
    "after": []
  }
}
```
Structured-data diff:
```json
{
  "before": {
    "accession": "SAMEA120503848",
    "create": "2025-11-07T04:19:39.852Z",
    "update": "2025-11-12T09:29:43.510Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          },
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC3",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "18.3",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          }
        ]
      }
    ]
  },
  "after": {
    "accession": "SAMEA120503848",
    "create": "2025-11-07T04:19:39.852Z",
    "update": "2025-11-12T09:29:43.510Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          },
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC3",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "18.3",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          }
        ]
      }
    ]
  }
}
```

## SAMEA120503849
Name: C008aK -> C008
Level: [{'text': 'macrosample'}] -> [{'text': 'specimen'}]
Parent: ['SAMEA120503849'] -> []
Incoming links (read-only): [{'source': 'SAMEA120503868', 'type': 'derived from', 'target': 'SAMEA120503849'}, {'source': 'SAMEA120503869', 'type': 'derived from', 'target': 'SAMEA120503849'}]
Structured data: unchanged
```json
{
  "characteristics": {
    "before": {
      "SRA accession": [
        {
          "text": "ERS27204536"
        }
      ],
      "level": [
        {
          "text": "macrosample"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    },
    "after": {
      "SRA accession": [
        {
          "text": "ERS27204536"
        }
      ],
      "level": [
        {
          "text": "specimen"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    }
  },
  "name": {
    "before": "C008aK",
    "after": "C008"
  },
  "relationships": {
    "before": [
      {
        "source": "SAMEA120503849",
        "type": "derived from",
        "target": "SAMEA120503849"
      }
    ],
    "after": []
  }
}
```
Structured-data diff:
```json
{
  "before": {
    "accession": "SAMEA120503849",
    "create": "2025-11-07T04:19:40.590Z",
    "update": "2025-11-12T09:29:44.390Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC3",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "17.3",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          }
        ]
      }
    ]
  },
  "after": {
    "accession": "SAMEA120503849",
    "create": "2025-11-07T04:19:40.590Z",
    "update": "2025-11-12T09:29:44.390Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC3",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "17.3",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          }
        ]
      }
    ]
  }
}
```

## SAMEA120503850
Name: C009aK -> C009
Level: [{'text': 'macrosample'}] -> [{'text': 'specimen'}]
Parent: ['SAMEA120503850'] -> []
Incoming links (read-only): [{'source': 'SAMEA120503870', 'type': 'derived from', 'target': 'SAMEA120503850'}, {'source': 'SAMEA120503871', 'type': 'derived from', 'target': 'SAMEA120503850'}]
Structured data: unchanged
```json
{
  "characteristics": {
    "before": {
      "SRA accession": [
        {
          "text": "ERS27204537"
        }
      ],
      "level": [
        {
          "text": "macrosample"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    },
    "after": {
      "SRA accession": [
        {
          "text": "ERS27204537"
        }
      ],
      "level": [
        {
          "text": "specimen"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    }
  },
  "name": {
    "before": "C009aK",
    "after": "C009"
  },
  "relationships": {
    "before": [
      {
        "source": "SAMEA120503850",
        "type": "derived from",
        "target": "SAMEA120503850"
      }
    ],
    "after": []
  }
}
```
Structured-data diff:
```json
{
  "before": {
    "accession": "SAMEA120503850",
    "create": "2025-11-07T04:19:41.375Z",
    "update": "2025-11-12T09:29:45.222Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          },
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC3",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "18.0",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          }
        ]
      }
    ]
  },
  "after": {
    "accession": "SAMEA120503850",
    "create": "2025-11-07T04:19:41.375Z",
    "update": "2025-11-12T09:29:45.222Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          },
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC3",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "18.0",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          }
        ]
      }
    ]
  }
}
```

## SAMEA120503851
Name: C010aK -> C010
Level: [{'text': 'macrosample'}] -> [{'text': 'specimen'}]
Parent: ['SAMEA120503851'] -> []
Incoming links (read-only): [{'source': 'SAMEA120503872', 'type': 'derived from', 'target': 'SAMEA120503851'}, {'source': 'SAMEA120503873', 'type': 'derived from', 'target': 'SAMEA120503851'}]
Structured data: unchanged
```json
{
  "characteristics": {
    "before": {
      "SRA accession": [
        {
          "text": "ERS27204538"
        }
      ],
      "level": [
        {
          "text": "macrosample"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    },
    "after": {
      "SRA accession": [
        {
          "text": "ERS27204538"
        }
      ],
      "level": [
        {
          "text": "specimen"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    }
  },
  "name": {
    "before": "C010aK",
    "after": "C010"
  },
  "relationships": {
    "before": [
      {
        "source": "SAMEA120503851",
        "type": "derived from",
        "target": "SAMEA120503851"
      }
    ],
    "after": []
  }
}
```
Structured-data diff:
```json
{
  "before": {
    "accession": "SAMEA120503851",
    "create": "2025-11-07T04:19:42.117Z",
    "update": "2025-11-12T09:29:46.196Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC4",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet+FluorescentMannan",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "18.7",
              "iri": null
            }
          }
        ]
      }
    ]
  },
  "after": {
    "accession": "SAMEA120503851",
    "create": "2025-11-07T04:19:42.117Z",
    "update": "2025-11-12T09:29:46.196Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC4",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet+FluorescentMannan",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "18.7",
              "iri": null
            }
          }
        ]
      }
    ]
  }
}
```

## SAMEA120503852
Name: C011aK -> C011
Level: [{'text': 'macrosample'}] -> [{'text': 'specimen'}]
Parent: ['SAMEA120503852'] -> []
Incoming links (read-only): [{'source': 'SAMEA120503874', 'type': 'derived from', 'target': 'SAMEA120503852'}, {'source': 'SAMEA120503875', 'type': 'derived from', 'target': 'SAMEA120503852'}]
Structured data: unchanged
```json
{
  "characteristics": {
    "before": {
      "SRA accession": [
        {
          "text": "ERS27204539"
        }
      ],
      "level": [
        {
          "text": "macrosample"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    },
    "after": {
      "SRA accession": [
        {
          "text": "ERS27204539"
        }
      ],
      "level": [
        {
          "text": "specimen"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    }
  },
  "name": {
    "before": "C011aK",
    "after": "C011"
  },
  "relationships": {
    "before": [
      {
        "source": "SAMEA120503852",
        "type": "derived from",
        "target": "SAMEA120503852"
      }
    ],
    "after": []
  }
}
```
Structured-data diff:
```json
{
  "before": {
    "accession": "SAMEA120503852",
    "create": "2025-11-07T04:19:42.872Z",
    "update": "2025-11-12T09:29:47.225Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          },
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet+FluorescentMannan",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC4",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "17.6",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          }
        ]
      }
    ]
  },
  "after": {
    "accession": "SAMEA120503852",
    "create": "2025-11-07T04:19:42.872Z",
    "update": "2025-11-12T09:29:47.225Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          },
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet+FluorescentMannan",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC4",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "17.6",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          }
        ]
      }
    ]
  }
}
```

## SAMEA120503853
Name: C012aK -> C012
Level: [{'text': 'macrosample'}] -> [{'text': 'specimen'}]
Parent: ['SAMEA120503853'] -> []
Incoming links (read-only): [{'source': 'SAMEA120503876', 'type': 'derived from', 'target': 'SAMEA120503853'}, {'source': 'SAMEA120503877', 'type': 'derived from', 'target': 'SAMEA120503853'}]
Structured data: unchanged
```json
{
  "characteristics": {
    "before": {
      "SRA accession": [
        {
          "text": "ERS27204540"
        }
      ],
      "level": [
        {
          "text": "macrosample"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    },
    "after": {
      "SRA accession": [
        {
          "text": "ERS27204540"
        }
      ],
      "level": [
        {
          "text": "specimen"
        }
      ],
      "organism": [
        {
          "text": "Sus scrofa"
        }
      ],
      "species": [
        {
          "text": "pig"
        }
      ]
    }
  },
  "name": {
    "before": "C012aK",
    "after": "C012"
  },
  "relationships": {
    "before": [
      {
        "source": "SAMEA120503853",
        "type": "derived from",
        "target": "SAMEA120503853"
      }
    ],
    "after": []
  }
}
```
Structured-data diff:
```json
{
  "before": {
    "accession": "SAMEA120503853",
    "create": "2025-11-07T04:19:43.814Z",
    "update": "2025-11-12T09:29:48.139Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC4",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet+FluorescentMannan",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "16.2",
              "iri": null
            }
          }
        ]
      }
    ]
  },
  "after": {
    "accession": "SAMEA120503853",
    "create": "2025-11-07T04:19:43.814Z",
    "update": "2025-11-12T09:29:48.139Z",
    "data": [
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "project",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "3D'omics",
              "iri": "https://cordis.europa.eu/project/id/101000309"
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB86267",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB86267"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "data",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "Metabolomics",
              "iri": null
            },
            "value": {
              "value": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210",
              "iri": "https://www.ebi.ac.uk/metabolights/editor/MTBLS13210"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "sample",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "storage",
              "iri": null
            },
            "value": {
              "value": "-70 ºC",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "type",
              "iri": null
            },
            "value": {
              "value": "Tissue",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "container",
              "iri": null
            },
            "value": {
              "value": "5 mL tube",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "origin",
              "iri": null
            },
            "value": {
              "value": "Caecum",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "study",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "name",
              "iri": null
            },
            "value": {
              "value": "C - Proof-of-principle swine trial",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "bioproject",
              "iri": null
            },
            "value": {
              "value": "PRJEB100724",
              "iri": "https://www.ebi.ac.uk/ena/browser/view/PRJEB100724"
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "treatment",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "code",
              "iri": null
            },
            "value": {
              "value": "TC4",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "description",
              "iri": null
            },
            "value": {
              "value": "ControlDiet+FluorescentMannan",
              "iri": null
            }
          }
        ]
      },
      {
        "domain": null,
        "webinSubmissionAccountId": "Webin-69627",
        "type": "animal",
        "schema": null,
        "content": [
          {
            "metric": {
              "value": "age (days from birth)",
              "iri": null
            },
            "value": {
              "value": "40",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "sex",
              "iri": null
            },
            "value": {
              "value": "male",
              "iri": null
            }
          },
          {
            "metric": {
              "value": "weight (kg)",
              "iri": null
            },
            "value": {
              "value": "16.2",
              "iri": null
            }
          }
        ]
      }
    ]
  }
}
```
