import {
  SelectInterface,
  IncludesInterface,
} from "./ManyJobApplicationsInterface";
import prisma from "../globalPrismaClient";

interface SelectStructureInterface {
  applicationDate?: boolean;
  applicationLink?: boolean;
  createdAt?: boolean;
  description?: boolean;
  id?: boolean;
  notes?: boolean;
  positionIndex?: boolean;
  status?: boolean;
  updatedAt?: boolean;
  documents?: boolean;
  applicationGroup?: boolean;
  tags?: boolean;
  interviews?: boolean;
  job?:
    | {
        select: {
          id?: boolean;
          title?: boolean;
          responsibilities?: boolean;
          description?: boolean;
          workMode?: boolean;
          createdAt?: boolean;
          updatedAt?: boolean;
          address?: {
            select: {
              city?: boolean;
              country?: boolean;
              postalCode?: boolean;
              state?: boolean;
              streetAddress?: boolean;
              streetAddress2?: boolean;
            };
          };
          company?: {
            select: {
              id?: boolean;
              name?: boolean;
              createdAt?: boolean;
              updatedAt?: boolean;
              details?: {
                select: {
                  culture?: boolean;
                  industry?: boolean;
                  size?: boolean;
                  website?: boolean;
                  type?: boolean;
                  history?: boolean;
                  mission?: boolean;
                  vision?: boolean;
                  values?: boolean;
                  description?: boolean;
                };
              };
              preferences?: {
                select: {
                  notes?: boolean;
                  desireability?: boolean;
                };
              };
            };
          };
          benefits?: {
            select: {
              benefit: {
                select: {
                  name: boolean;
                };
              };
            };
            orderBy: {
              benefit: {
                name: "asc";
              };
            };
          };
          compensation?: {
            select: {
              payAmount?: boolean;
              payFrequency?: boolean;
              currency?: boolean;
              salaryRangeMin?: boolean;
              salaryRangeMax?: boolean;
              hoursWeek?: boolean;
              negotiable?: boolean;
            };
          };
        };
      }
    | true;
}

const jobColumns = Object.keys(prisma.job.fields);
const allJobColumnsFormattedForSelect: { [key: string]: boolean } = {};
jobColumns.forEach((field) => {
  allJobColumnsFormattedForSelect[field] = true;
});

export const buildSelectQuery = (
  select?: SelectInterface,
  includes?: IncludesInterface
) => {
  const selectQuery: SelectStructureInterface = {};

  if (select) {
    if (select.applicationDate) {
      selectQuery.applicationDate = true;
    }

    if (select.applicationLink) {
      selectQuery.applicationLink = true;
    }

    if (select.createdAt) {
      selectQuery.createdAt = true;
    }

    if (select.description) {
      selectQuery.description = true;
    }

    if (select.id) {
      selectQuery.id = true;
    }

    if (select.notes) {
      selectQuery.notes = true;
    }

    if (select.positionIndex) {
      selectQuery.positionIndex = true;
    }

    if (select.status) {
      selectQuery.status = true;
    }

    if (select.updatedAt) {
      selectQuery.updatedAt = true;
    }

    if (select.jobFields) {
      selectQuery.job = { select: {} };
      const jobSelect = selectQuery.job.select;

      if (select.jobFields.id) {
        jobSelect.id = true;
      }

      if (select.jobFields.title) {
        jobSelect.title = true;
      }

      if (select.jobFields.responsibilities) {
        jobSelect.responsibilities = true;
      }

      if (select.jobFields.description) {
        jobSelect.description = true;
      }

      if (select.jobFields.workMode) {
        jobSelect.workMode = true;
      }

      if (select.jobFields.benefits) {
        jobSelect.benefits = {
          select: { benefit: { select: { name: true } } },
          orderBy: { benefit: { name: "asc" } },
        };
      }
    }

    if (select.companyFields) {
      if (selectQuery.job && selectQuery.job !== true) {
        selectQuery.job.select.company = { select: {} };
      } else {
        selectQuery.job = {
          select: {
            company: { select: {} },
          },
        };
      }
      const companySelect = selectQuery.job.select.company?.select || {};

      if (select.companyFields.id) {
        companySelect.id = true;
      }

      if (select.companyFields.name) {
        companySelect.name = true;
      }

      if (select.companyFields.createdAt) {
        companySelect.createdAt = true;
      }

      if (select.companyFields.updatedAt) {
        companySelect.updatedAt = true;
      }

      if (select.companyFields.notes) {
        companySelect.preferences = { select: { notes: true } };
      }

      if (select.companyFields.desireability) {
        if (companySelect.preferences) {
          companySelect.preferences.select.desireability = true;
        } else {
          companySelect.preferences = { select: { desireability: true } };
        }
      }

      if (select.companyFields.culture) {
        companySelect.details = { select: { culture: true } };
      }

      if (select.companyFields.industry) {
        if (companySelect.details) {
          companySelect.details.select.industry = true;
        } else {
          companySelect.details = { select: { industry: true } };
        }
      }

      if (select.companyFields.size) {
        if (companySelect.details) {
          companySelect.details.select.size = true;
        } else {
          companySelect.details = { select: { size: true } };
        }
      }

      if (select.companyFields.website) {
        if (companySelect.details) {
          companySelect.details.select.website = true;
        } else {
          companySelect.details = { select: { website: true } };
        }
      }

      if (select.companyFields.type) {
        if (companySelect.details) {
          companySelect.details.select.type = true;
        } else {
          companySelect.details = { select: { type: true } };
        }
      }

      if (select.companyFields.history) {
        if (companySelect.details) {
          companySelect.details.select.history = true;
        } else {
          companySelect.details = { select: { history: true } };
        }
      }

      if (select.companyFields.mission) {
        if (companySelect.details) {
          companySelect.details.select.mission = true;
        } else {
          companySelect.details = { select: { mission: true } };
        }
      }

      if (select.companyFields.vision) {
        if (companySelect.details) {
          companySelect.details.select.vision = true;
        } else {
          companySelect.details = { select: { vision: true } };
        }
      }

      if (select.companyFields.values) {
        if (companySelect.details) {
          companySelect.details.select.values = true;
        } else {
          companySelect.details = { select: { values: true } };
        }
      }

      if (select.companyFields.description) {
        if (companySelect.details) {
          companySelect.details.select.description = true;
        } else {
          companySelect.details = { select: { description: true } };
        }
      }
    }

    if (select.addressFields) {
      if (selectQuery.job && selectQuery.job !== true) {
        selectQuery.job.select.address = { select: {} };
      } else {
        selectQuery.job = {
          select: {
            address: { select: {} },
          },
        };
      }
      const addressSelect = selectQuery.job.select.address?.select || {};

      if (select.addressFields.city) {
        addressSelect.city = true;
      }

      if (select.addressFields.country) {
        addressSelect.country = true;
      }

      if (select.addressFields.postalCode) {
        addressSelect.postalCode = true;
      }

      if (select.addressFields.state) {
        addressSelect.state = true;
      }

      if (select.addressFields.streetAddress) {
        addressSelect.streetAddress = true;
      }

      if (select.addressFields.streetAddress2) {
        addressSelect.streetAddress2 = true;
      }
    }
  }

  if (includes) {
    if (includes.job) {
      if (selectQuery.job && selectQuery.job !== true) {
        selectQuery.job = {
          select: {
            ...allJobColumnsFormattedForSelect,
            ...selectQuery.job.select,
          },
        };
      } else {
        selectQuery.job = { select: allJobColumnsFormattedForSelect };
      }
    }

    if (includes.address && selectQuery.job !== true) {
      if (!selectQuery.job?.select) {
        selectQuery.job = {
          select: {
            address: { select: {} },
          },
        };
      }
      selectQuery.job.select.address = {
        select: {
          city: true,
          country: true,
          postalCode: true,
          state: true,
          streetAddress: true,
          streetAddress2: true,
        },
      };
    }

    if (includes.company && selectQuery.job !== true) {
      if (!selectQuery.job?.select) {
        selectQuery.job = {
          select: {
            company: { select: {} },
          },
        };
      }
      selectQuery.job.select.company = {
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          details: {
            select: {
              culture: true,
              industry: true,
              size: true,
              website: true,
              type: true,
              history: true,
              mission: true,
              vision: true,
              values: true,
              description: true,
            },
          },
          preferences: {
            select: {
              notes: true,
              desireability: true,
            },
          },
        },
      };
    }

    if (includes.compensation && selectQuery.job !== true) {
      if (!selectQuery.job?.select) {
        selectQuery.job = {
          select: {
            ...allJobColumnsFormattedForSelect,
            compensation: { select: {} },
          },
        };
      }
      selectQuery.job.select.compensation = {
        select: {
          payAmount: true,
          payFrequency: true,
          currency: true,
          salaryRangeMin: true,
          salaryRangeMax: true,
          hoursWeek: true,
          negotiable: true,
        },
      };
    }

    if (includes.documents) {
      selectQuery.documents = true;
    }

    if (includes.group) {
      selectQuery.applicationGroup = true;
    }

    if (includes.interviews) {
      selectQuery.interviews = true;
    }

    if (includes.tags) {
      selectQuery.tags = true;
    }
  }

  if (!includes && !select) {
    selectQuery.id = true;
    selectQuery.applicationDate = true;
    selectQuery.applicationLink = true;
    selectQuery.status = true;
    selectQuery.positionIndex = true;
    selectQuery.notes = true;
    selectQuery.job = {
      select: {
        ...allJobColumnsFormattedForSelect,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    };
  }

  return selectQuery;
};
