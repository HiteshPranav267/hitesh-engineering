
export type Year = '1' | '2' | '3' | '4';
export type Department = 'S&H' | 'ECE' | 'CSE' | 'Other';
export type ResourceType = 'PDF' | 'Website' | 'Drive' | 'GitHub' | 'Image' | 'Other';

export interface Resource {
    id: string;
    title: string;
    subject: string;
    year: Year;
    department: Department;
    type: ResourceType;
    url: string;
    semester?: number;
    description?: string;
    tags?: string[];
}

export const resources: Resource[] = [
    {
        "title": "PYQs",
        "subject": "General",
        "year": "1",
        "department": "S&H",
        "type": "Drive",
        "url": "https://drive.google.com/drive/folders/11U56PJ-VZ_5zaJ1fVrV6h3kzN4rnNX7E",
        "semester": 1,
        "id": "res-1"
    },
    {
        "id": "res-local-0",
        "title": "chem esa checklist",
        "subject": "Chemistry",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/chem/chem_esa_checklist.pdf",
        "tags": []
    },
    {
        "id": "res-local-1",
        "title": "chem lab",
        "subject": "Chemistry",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/chem/chem_lab.pdf",
        "tags": []
    },
    {
        "id": "res-local-2",
        "title": "chem practise notes",
        "subject": "Chemistry",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/chem/chem_practise_notes.pdf",
        "tags": []
    },
    {
        "id": "res-local-3",
        "title": "chem u1 p1",
        "subject": "Chemistry",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/chem/chem_u1_p1.pdf",
        "tags": []
    },
    {
        "id": "res-local-4",
        "title": "chem u1 p2",
        "subject": "Chemistry",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/chem/chem_u1_p2.pdf",
        "tags": []
    },
    {
        "id": "res-local-5",
        "title": "chem u2 p1",
        "subject": "Chemistry",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/chem/chem_u2_p1.pdf",
        "tags": []
    },
    {
        "id": "res-local-6",
        "title": "chem u2 p2",
        "subject": "Chemistry",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/chem/chem_u2_p2.pdf",
        "tags": []
    },
    {
        "id": "res-local-7",
        "title": "chem u3",
        "subject": "Chemistry",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/chem/chem_u3.pdf",
        "tags": []
    },
    {
        "id": "res-local-8",
        "title": "chem u4 p1",
        "subject": "Chemistry",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/chem/chem_u4_p1.pdf",
        "tags": []
    },
    {
        "id": "res-local-9",
        "title": "chem u4 p2",
        "subject": "Chemistry",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/chem/chem_u4_p2.pdf",
        "tags": []
    },
    {
        "id": "res-local-10",
        "title": "chem u4 p3",
        "subject": "Chemistry",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/chem/chem_u4_p3.pdf",
        "tags": []
    },
    {
        "id": "res-local-11",
        "title": "epd u1",
        "subject": "EPD",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/epd/epd_u1.pdf",
        "tags": []
    },
    {
        "id": "res-local-12",
        "title": "epd u3",
        "subject": "EPD",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/epd/epd_u3.pdf",
        "tags": []
    },
    {
        "id": "res-local-13",
        "title": "epd u4",
        "subject": "EPD",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/epd/epd_u4.pdf",
        "tags": []
    },
    {
        "id": "res-local-14",
        "title": "Mechanics Statics Course Information",
        "subject": "Mechanics - Statics",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/mechanics/course_info.pdf",
        "tags": []
    },
    {
        "id": "res-local-15",
        "title": "Mechanics Statics Theory Notes",
        "subject": "Mechanics - Statics",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/mechanics/Mechanics_Statics_Complete.pdf",
        "tags": []
    },
    {
        "id": "res-local-16",
        "title": "Consitution QA",
        "subject": "Constitution",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/constitution/AllConstitutionQA.pdf",
        "tags": []
    },
    {
        "id": "res-local-17",
        "title": "QB Swami Vivekananda",
        "subject": "Constitution",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/constitution/AllSwamiVivekanandaQA.pdf",
        "tags": []
    },
    {
        "id": "res-local-18",
        "title": "QB Mahatma Gandhi",
        "subject": "Constitution",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/constitution/AllMahatmaGandhiQA.pdf",
        "tags": []
    },
    {
        "id": "res-local-19",
        "title": "Physics U1 to U4 Notes",
        "subject": "Physics",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/physics/Physics_U1_to_U4_Notes.pdf",
        "tags": []
    },
    {
        "id": "res-local-20",
        "title": "Faisal Sir Slides",
        "subject": "Physics",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/physics/Faisal_Sir_Slides.pdf",
        "tags": []
    },
    {
        "id": "res-local-21",
        "title": "PESU Notes",
        "subject": "Physics",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/physics/Phy_PESU_Notes.pdf",
        "tags": []
    },
    {
        "id": "res-local-22",
        "title": "Phy U1 Notes",
        "subject": "Physics",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/physics/U1_Notes.pdf",
        "tags": []
    },
    {
        "id": "res-local-23",
        "title": "Mechanical U1 Notes",
        "subject": "Mechanical",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/mechanical/mech_u1.pdf",
        "tags": []
    },
    {
        "id": "res-local-24",
        "title": "Mechanical U2 Notes Part 1",
        "subject": "Mechanical",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/mechanical/mech_u2_p1.pdf",
        "tags": []
    },
    {
        "id": "res-local-25",
        "title": "Mechanical U2 Notes Part 2",
        "subject": "Mechanical",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/mechanical/mech_u2_p2.pdf",
        "tags": []
    },
    {
        "id": "res-local-26",
        "title": "Mechanical U3 Notes",
        "subject": "Mechanical",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/mechanical/mech_u3.pdf",
        "tags": []
    },
    {
        "id": "res-local-27",
        "title": "Mechanical U4 Notes",
        "subject": "Mechanical",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/mechanical/mech_u4.pdf",
        "tags": []
    },
    {
        "id": "res-local-28",
        "title": "Mechanical ESA Important List",
        "subject": "Mechanical",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/mechanical/mechanical_esa_revision_imp_stuff.pdf",
        "tags": []
    },
    {
        "id": "res-local-29",
        "title": "EEE U1 Notes",
        "subject": "Electrical",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/eee/eee_u1.pdf",
        "tags": []
    },
    {
        "id": "res-local-30",
        "title": "EEE U2 Notes",
        "subject": "Electrical",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/eee/eee_u2.pdf",
        "tags": []
    },
    {
        "id": "res-local-31",
        "title": "EEE U3 Notes",
        "subject": "Electrical",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/eee/eee_u3.pdf",
        "tags": []
    },
    {
        "id": "res-local-34",
        "title": "EEE U4 Notes",
        "subject": "Electrical",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/eee/eee_u4.pdf",
        "tags": []
    },
    {
        "id": "res-local-35",
        "title": "EEE Theory and Derivations",
        "subject": "Electrical",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/eee/eee_theory_and_derivations.pdf",
        "tags": []
    },
    {
        "id": "res-local-36",
        "title": "EVS",
        "subject": "EVS",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/evs/evs.pdf",
        "tags": []
    },
    {
        "id": "res-local-37",
        "title": "C Notes",
        "subject": "C",
        "year": "1",
        "department": "S&H",
        "type": "Website",
        "url": "https://hitesh-notes.notion.site/c-notes",
        "tags": []
    },
];
