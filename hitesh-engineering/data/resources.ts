
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
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/epd/epd_u1.pdf",
        "tags": []
    },
    {
        "id": "res-local-12",
        "title": "epd u3",
        "subject": "EPD",
        "year": "1",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/epd/epd_u3.pdf",
        "tags": []
    },
    {
        "id": "res-local-13",
        "title": "epd u4",
        "subject": "EPD",
        "year": "1",
        "department": "ECE",
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
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/eee/eee_u1.pdf",
        "tags": []
    },
    {
        "id": "res-local-30",
        "title": "EEE U2 Notes",
        "subject": "Electrical",
        "year": "1",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/eee/eee_u2.pdf",
        "tags": []
    },
    {
        "id": "res-local-31",
        "title": "EEE U3 Notes",
        "subject": "Electrical",
        "year": "1",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/eee/eee_u3.pdf",
        "tags": []
    },
    {
        "id": "res-local-34",
        "title": "EEE U4 Notes",
        "subject": "Electrical",
        "year": "1",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/eee/eee_u4.pdf",
        "tags": []
    },
    {
        "id": "res-local-35",
        "title": "EEE Theory and Derivations",
        "subject": "Electrical",
        "year": "1",
        "department": "ECE",
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
        "department": "CSE",
        "type": "Website",
        "url": "https://hitesh-notes.notion.site/c-notes",
        "tags": []
    },

    {
        "id": "res-local-39",
        "title": "M1 U1 Notes",
        "subject": "Mathematics 1",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/m1/m1_u1_notes.pdf",
        "tags": []
    },
    {
        "id": "res-local-40",
        "title": "M1 U2 Notes",
        "subject": "Mathematics 1",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/m1/m1_u2_notes.pdf",
        "tags": []
    },
    {
        "id": "res-local-41",
        "title": "M1 U3 Notes",
        "subject": "Mathematics 1",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/m1/m1_u3_notes.pdf",
        "tags": []
    },
    {
        "id": "res-local-42",
        "title": "M1 U4 Notes",
        "subject": "Mathematics 1",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/m1/m1_u4_notes.pdf",
        "tags": []
    },
    {
        "id": "res-local-43",
        "title": "M1 Self Learning",
        "subject": "Mathematics 1",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/m1/m1_self_learning.pdf",
        "tags": []
    },
    {
        "id": "res-local-44",
        "title": "M1 Special Functions Proofs",
        "subject": "Mathematics 1",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/m1/m1_special_fns_proofs.pdf",
        "tags": []
    },
    {
        "id": "res-local-46",
        "title": "M1 U1 & U2 Formulas",
        "subject": "Mathematics 1",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/m1/m1_u1_u2_formulas.pdf",
        "tags": []
    },
    {
        "id": "res-local-47",
        "title": "M1 U3 & U4 Formulas",
        "subject": "Mathematics 1",
        "year": "1",
        "department": "S&H",
        "type": "PDF",
        "url": "/notes/m1/m1_u3_u4_formulas.pdf",
        "tags": []
    },
    {
        "id": "res-local-48",
        "title": "Python U1 Notes",
        "subject": "Python",
        "year": "1",
        "department": "CSE",
        "type": "PDF",
        "url": "/notes/python/py_u1.pdf",
        "tags": []
    },
    {
        "id": "res-local-49",
        "title": "Python U2 Notes",
        "subject": "Python",
        "year": "1",
        "department": "CSE",
        "type": "PDF",
        "url": "/notes/python/py_u2.pdf",
        "tags": []
    },
    {
        "id": "res-local-50",
        "title": "Python U3 Notes",
        "subject": "Python",
        "year": "1",
        "department": "CSE",
        "type": "PDF",
        "url": "/notes/python/py_u3.pdf",
        "tags": []
    },
    {
        "id": "res-local-51",
        "title": "Python U4 Notes",
        "subject": "Python",
        "year": "1",
        "department": "CSE",
        "type": "PDF",
        "url": "/notes/python/py_u4.pdf",
        "tags": []
    },
    {
        "id": "res-local-52",
        "title": "Python OOPS Notes",
        "subject": "Python",
        "year": "1",
        "department": "CSE",
        "type": "PDF",
        "url": "/notes/python/py_oops.pdf",
        "tags": []
    },
    {
        "id": "res-local-53",
        "title": "Anga Sem 3 Notes",
        "subject": "CSE",
        "year": "2",
        "department": "CSE",
        "type": "Website",
        "url": "https://drive.anga.codes/collection?id=PjLWuUIpND6RDbR",
        "tags": []
    },
    {
        "id": "res-local-54",
        "title": "Anga Sem 4 Notes",
        "subject": "CSE",
        "year": "2",
        "department": "CSE",
        "type": "Website",
        "url": "https://drive.anga.codes/collection?id=4HDmSZ1bkQWwfFz",
        "tags": []
    },
    {
        "id": "res-local-55",
        "title": "Anga Sem 5 Notes",
        "subject": "CSE",
        "year": "3",
        "department": "CSE",
        "type": "Website",
        "url": "https://drive.anga.codes/collection?id=UP3dwiNBROnrnHu",
        "tags": []
    },
    {
        "id": "res-local-56",
        "title": "Siri's Study Stash Sem 3",
        "subject": "CSE",
        "year": "2",
        "department": "CSE",
        "type": "Website",
        "url": "https://siri123blog.wordpress.com/2024/11/24/semester-3/",
        "tags": []
    },
    {
        "id": "res-local-57",
        "title": "Siri's Study Stash Sem 4",
        "subject": "CSE",
        "year": "2",
        "department": "CSE",
        "type": "Website",
        "url": "https://siri123blog.wordpress.com/2025/05/07/semester-4/",
        "tags": []
    },
    {
        "id": "res-local-58",
        "title": "Siri's Study Stash Sem 5",
        "subject": "CSE",
        "year": "3",
        "department": "CSE",
        "type": "Website",
        "url": "https://siri123blog.wordpress.com/2025/12/09/semester-5/",
        "tags": []
    },
    {
        "id": "res-local-59",
        "title": "Siri's Study Stash Sem 6",
        "subject": "CSE",
        "year": "3",
        "department": "CSE",
        "type": "Website",
        "url": "https://siri123blog.wordpress.com/2026/01/07/semester-6/",
        "tags": []
    },
    {
        "id": "res-local-60",
        "title": "C++ Notes (Made for fun, not curriculum)",
        "subject": "Other",
        "year": "1",
        "department": "Other",
        "type": "Website",
        "url": "https://hitesh-notes.notion.site/cpp",
        "tags": []
    },
    {
        "id": "res-local-61",
        "title": "LA MATLAB Programs",
        "subject": "LA",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/la/la_matlab_programs.pdf",
        "tags": []
    },
    {
        "id": "res-local-62",
        "title": "LA MATLAB Slides",
        "subject": "LA",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/la/la_matlab_slides.pdf",
        "tags": []
    },
    {
        "id": "res-local-63",
        "title": "LA U1 and U2 Formulas",
        "subject": "LA",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/la/la_u1_u2_formulas.pdf",
        "tags": []
    },
    {
        "id": "res-local-64",
        "title": "LA U1 and U2 Classwork Problems",
        "subject": "LA",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/la/la_u1_u2.pdf",
        "tags": []
    },
    {
        "id": "res-local-65",
        "title": "LA U3 and U4 Formulas",
        "subject": "LA",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/la/la_u3_u4_formulas.pdf",
        "tags": []
    },
    {
        "id": "res-local-66",
        "title": "LA Vibha Notes",
        "subject": "LA",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/la/la_vibha.pdf",
        "tags": []
    },
    {
        "id": "res-local-67",
        "title": "CADD Notes U1-4",
        "subject": "CADD",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/cadd/cadd_u1_4.pdf",
        "tags": []
    },
    {
        "id": "res-local-68",
        "title": "CADD Textbook",
        "subject": "CADD",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/cadd/cadd_tb.pdf",
        "tags": []
    },
    {
        "id": "res-local-69",
        "title": "ACD U1 and U2 Notes",
        "subject": "ACD",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/acd/acd_u1_u2.pdf",
        "tags": []
    },
    {
        "id": "res-local-70",
        "title": "ACD U3 Notes",
        "subject": "ACD",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/acd/acd_u3.pdf",
        "tags": []
    },
    {
        "id": "res-local-71",
        "title": "ACD U4 Notes",
        "subject": "ACD",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/acd/acd_u4.pdf",
        "tags": []
    },
    {
        "id": "res-local-72",
        "title": "NAS Notes U1 and U2",
        "subject": "NAS",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/nas/nas_u1_u2.pdf",
        "tags": []
    },
    {
        "id": "res-local-73",
        "title": "NAS Notes U3",
        "subject": "NAS",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/nas/nas_u3.pdf",
        "tags": []
    },
    {
        "id": "res-local-74",
        "title": "NAS Notes U4",
        "subject": "NAS",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/nas/nas_u4.pdf",
        "tags": []
    },
    {
        "id": "res-local-75",
        "title": "SNS Notes U1",
        "subject": "S&S",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/sns/sns_u1.pdf",
        "tags": []
    },
    {
        "id": "res-local-76",
        "title": "SNS Notes U2 , U3 and U4",
        "subject": "S&S",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/sns/sns_u2_u3_u4.pdf",
        "tags": []
    },
    {
        "id": "res-local-77",
        "title": "MEE Notes U1 and U2",
        "subject": "MEE",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/mee/mee_u1_u2.pdf",
        "tags": []
    },
    {
        "id": "res-local-78",
        "title": "MEE Notes U3",
        "subject": "MEE",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/mee/mee_u3.pdf",
        "tags": []
    },
    {
        "id": "res-local-79",
        "title": "MEE Notes U4",
        "subject": "MEE",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/mee/mee_u4.pdf",
        "tags": []
    },
    {
        "id": "res-local-80",
        "title": "CCN Interactive Practice Problems",
        "subject": "CNN",
        "year": "3",
        "department": "ECE",
        "type": "Website",
        "url": "https://docs.google.com/spreadsheets/d/1RtgOnQ59LrxhLY0xLFFq9tPBEf58jNgwGSVDOzcRGvg/edit?usp=sharing",
        "tags": []
    },
    {
        "id": "res-local-81",
        "title": "CCN Notes U1",
        "subject": "CNN",
        "year": "3",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/cnn/cnn_u1.pdf",
        "tags": []
    },
    {
        "id": "res-local-82",
        "title": "CCN Notes U2",
        "subject": "CNN",
        "year": "3",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/cnn/cnn_u2.pdf",
        "tags": []
    },
    {
        "id": "res-local-83",
        "title": "CCN Notes U3",
        "subject": "CNN",
        "year": "3",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/cnn/cnn_u3.pdf",
        "tags": []
    },
    {
        "id": "res-local-84",
        "title": "CCN Notes U4",
        "subject": "CNN",
        "year": "3",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/cnn/cnn_u4.pdf",
        "tags": []
    },
    {
        "id": "res-local-85",
        "title": "DSP Formulas and Derivations",
        "subject": "DSP",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/dsp/dsp_formulas.pdf",
        "tags": []
    },
    {
        "id": "res-local-86",
        "title": "DSP Notes U1 and U2",
        "subject": "DSP",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/dsp/dsp_u1_u2.pdf",
        "tags": []
    },
    {
        "id": "res-local-87",
        "title": "DSP Notes U3",
        "subject": "DSP",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/dsp/dsp_u3.pdf",
        "tags": []
    },
    {
        "id": "res-local-88",
        "title": "DSP Notes U4",
        "subject": "DSP",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/dsp/dsp_u4.pdf",
        "tags": []
    },
    {
        "id": "res-local-89",
        "title": "DSP Lab MATLAB Codes",
        "subject": "DSP",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/dsp/dsp_matlab_codes.txt",
        "tags": []
    },
    {
        "id": "res-local-90",
        "title": "DSP Lab Code Composer Codes",
        "subject": "DSP",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/dsp/dsp_codecomposer_codes.txt",
        "tags": []
    },
    {
        "id": "res-local-91",
        "title": "DVLSI U1 U2 Notes",
        "subject": "DVLSI",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/dvlsi/dvlsi_u1_u2.pdf",
        "tags": []
    },
    {
        "id": "res-local-46",
        "title": "DVLSI U3 U4 Notes",
        "subject": "DVLSI",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/dvlsi/dvlsi_u3_u4.pdf",
        "tags": []
    },
    {
        "id": "res-local-92",
        "title": "NAS U1 and U2 Notes",
        "subject": "NAS",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/nas/nas_u1_u2.pdf",
        "tags": []
    },
    {
        "id": "res-local-93",
        "title": "NAS U3 Notes",
        "subject": "NAS",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/nas/nas_u3.pdf",
        "tags": []
    },
    {
        "id": "res-local-94",
        "title": "NAS U4 Notes",
        "subject": "NAS",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/nas/nas_u4.pdf",
        "tags": []
    },
    {
        "id": "res-local-95",
        "title": "CS U1 to U4 Notes",
        "subject": "CS",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/cs/cs_u1_u2_u3_u4.pdf",
        "tags": []
    },
    {
        "id": "res-local-96",
        "title": "EMFT U1 Notes",
        "subject": "EMFT",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/emft/emft_u1.pdf",
        "tags": []
    },
    {
        "id": "res-local-97",
        "title": "EMFT U3 Notes",
        "subject": "EMFT",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/emft/emft_u3.pdf",
        "tags": []
    },
    {
        "id": "res-local-98",
        "title": "EMFT U4 Notes",
        "subject": "EMFT",
        "year": "2",
        "department": "ECE",
        "type": "PDF",
        "url": "/notes/emft/emft_u4.pdf",
        "tags": []
    },
    {
        "id": "res-local-99",
        "title": "Divya Notes",
        "subject": "ECE",
        "year": "2",
        "department": "ECE",
        "type": "Website",
        "url": "https://nandan-n.github.io/Div-notes-site/",
        "tags": []
    },
    {
        "id": "res-local-100",
        "title": "Divya Notes",
        "subject": "ECE",
        "year": "3",
        "department": "ECE",
        "type": "Website",
        "url": "https://nandan-n.github.io/Div-notes-site/",
        "tags": []
    },
    {
        "id": "res-local-101",
        "title": "COD Lab Codes",
        "subject": "COD",
        "year": "3",
        "department": "ECE",
        "type": "GitHub",
        "url": "https://github.com/HiteshPranav267/computer-organisation-and-design-UE23EC352A",
        "tags": []
    },
    {
        "id": "res-local-102",
        "title": "COD Mallikyesh Resources ",
        "subject": "COD",
        "year": "3",
        "department": "ECE",
        "type": "GitHub",
        "url": "https://github.com/Mallikyesh/RISCV",
        "tags": []
    },
];

// Template
/*
    {
        "id": "res-local-",
        "title": "",
        "subject": "",
        "year": "",
        "department": "",
        "type": "",
        "url": "",
        "tags": []
    },  

*/