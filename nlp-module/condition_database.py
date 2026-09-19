"""
Cardiac condition knowledge base.
Maps medical conditions to specific heart anatomical regions and Unity object names.
"""

CARDIAC_CONDITIONS = [
    # Ventricular conditions
    {
        "name": "Left Ventricular Hypertrophy",
        "code": "LVH",
        "keywords": ["left ventricular hypertrophy", "lvh", "left ventricle hypertrophy",
                      "concentric hypertrophy", "eccentric hypertrophy", "lv hypertrophy",
                      "left ventricular enlargement", "thickened left ventricle"],
        "region": "Left Ventricle",
        "unity_object": "heart_left_ventricle",
        "description": "Thickening of the left ventricular myocardium"
    },
    {
        "name": "Right Ventricular Hypertrophy",
        "code": "RVH",
        "keywords": ["right ventricular hypertrophy", "rvh", "right ventricle hypertrophy",
                      "rv hypertrophy", "right ventricular enlargement"],
        "region": "Right Ventricle",
        "unity_object": "heart_right_ventricle",
        "description": "Thickening of the right ventricular myocardium"
    },
    {
        "name": "Left Ventricular Dysfunction",
        "code": "LVD",
        "keywords": ["left ventricular dysfunction", "lv dysfunction", "reduced ejection fraction",
                      "systolic dysfunction", "diastolic dysfunction", "lvef reduced",
                      "left ventricular failure", "lv systolic dysfunction"],
        "region": "Left Ventricle",
        "unity_object": "heart_left_ventricle",
        "description": "Impaired left ventricular function"
    },

    # Valve conditions
    {
        "name": "Mitral Valve Prolapse",
        "code": "MVP",
        "keywords": ["mitral valve prolapse", "mvp", "mitral prolapse",
                      "billowing mitral valve", "floppy mitral valve"],
        "region": "Mitral Valve",
        "unity_object": "heart_mitral_valve",
        "description": "Mitral valve leaflets bulge into the left atrium"
    },
    {
        "name": "Mitral Regurgitation",
        "code": "MR",
        "keywords": ["mitral regurgitation", "mitral insufficiency", "mitral valve regurgitation",
                      "mr ", "mitral leak", "mitral valve incompetence"],
        "region": "Mitral Valve",
        "unity_object": "heart_mitral_valve",
        "description": "Backward flow of blood through the mitral valve"
    },
    {
        "name": "Mitral Stenosis",
        "code": "MS",
        "keywords": ["mitral stenosis", "mitral valve stenosis", "narrowed mitral valve",
                      "mitral valve narrowing"],
        "region": "Mitral Valve",
        "unity_object": "heart_mitral_valve",
        "description": "Narrowing of the mitral valve opening"
    },
    {
        "name": "Aortic Stenosis",
        "code": "AS",
        "keywords": ["aortic stenosis", "aortic valve stenosis", "narrowed aortic valve",
                      "calcific aortic stenosis", "aortic valve narrowing", "aortic sclerosis"],
        "region": "Aortic Valve",
        "unity_object": "heart_aortic_valve",
        "description": "Narrowing of the aortic valve"
    },
    {
        "name": "Aortic Regurgitation",
        "code": "AR",
        "keywords": ["aortic regurgitation", "aortic insufficiency", "aortic valve regurgitation",
                      "aortic incompetence", "aortic leak"],
        "region": "Aortic Valve",
        "unity_object": "heart_aortic_valve",
        "description": "Backward flow of blood through the aortic valve"
    },
    {
        "name": "Tricuspid Regurgitation",
        "code": "TR",
        "keywords": ["tricuspid regurgitation", "tricuspid insufficiency",
                      "tricuspid valve regurgitation", "tricuspid incompetence"],
        "region": "Tricuspid Valve",
        "unity_object": "heart_tricuspid_valve",
        "description": "Backward flow of blood through the tricuspid valve"
    },
    {
        "name": "Pulmonary Stenosis",
        "code": "PS",
        "keywords": ["pulmonary stenosis", "pulmonic stenosis", "pulmonary valve stenosis",
                      "pulmonic valve stenosis"],
        "region": "Pulmonary Valve",
        "unity_object": "heart_pulmonary_valve",
        "description": "Narrowing of the pulmonary valve"
    },

    # Atrial conditions
    {
        "name": "Atrial Fibrillation",
        "code": "AFib",
        "keywords": ["atrial fibrillation", "a-fib", "afib", "af ", "a.fib",
                      "irregular atrial rhythm", "fibrillating atria"],
        "region": "Left Atrium",
        "unity_object": "heart_left_atrium",
        "description": "Irregular rapid heart rhythm originating in the atria"
    },
    {
        "name": "Left Atrial Enlargement",
        "code": "LAE",
        "keywords": ["left atrial enlargement", "lae", "dilated left atrium",
                      "left atrium enlargement", "left atrial dilatation", "la enlargement"],
        "region": "Left Atrium",
        "unity_object": "heart_left_atrium",
        "description": "Enlargement of the left atrium"
    },
    {
        "name": "Right Atrial Enlargement",
        "code": "RAE",
        "keywords": ["right atrial enlargement", "rae", "dilated right atrium",
                      "right atrium enlargement", "right atrial dilatation", "ra enlargement"],
        "region": "Right Atrium",
        "unity_object": "heart_right_atrium",
        "description": "Enlargement of the right atrium"
    },

    # Myocardial conditions
    {
        "name": "Anterior Myocardial Infarction",
        "code": "AMI",
        "keywords": ["anterior myocardial infarction", "anterior mi", "anterior wall mi",
                      "anterior stemi", "anterior wall infarction", "anteroseptal mi",
                      "anterior heart attack"],
        "region": "Left Ventricle",
        "unity_object": "heart_left_ventricle",
        "description": "Heart attack affecting the anterior wall of the left ventricle"
    },
    {
        "name": "Inferior Myocardial Infarction",
        "code": "IMI",
        "keywords": ["inferior myocardial infarction", "inferior mi", "inferior wall mi",
                      "inferior stemi", "inferior wall infarction", "inferior heart attack"],
        "region": "Right Ventricle",
        "unity_object": "heart_right_ventricle",
        "description": "Heart attack affecting the inferior wall"
    },
    {
        "name": "Myocardial Infarction",
        "code": "MI",
        "keywords": ["myocardial infarction", "heart attack", "mi ", "stemi", "nstemi",
                      "acute coronary syndrome", "acs"],
        "region": "Left Ventricle",
        "unity_object": "heart_left_ventricle",
        "description": "Heart attack — death of heart muscle tissue"
    },

    # Pericardial conditions
    {
        "name": "Pericarditis",
        "code": "PERI",
        "keywords": ["pericarditis", "pericardial inflammation", "inflamed pericardium"],
        "region": "Pericardium",
        "unity_object": "heart_pericardium",
        "description": "Inflammation of the pericardium"
    },
    {
        "name": "Pericardial Effusion",
        "code": "PE",
        "keywords": ["pericardial effusion", "fluid around heart", "pericardial fluid",
                      "cardiac tamponade"],
        "region": "Pericardium",
        "unity_object": "heart_pericardium",
        "description": "Excess fluid in the pericardial space"
    },

    # Coronary conditions
    {
        "name": "Coronary Artery Disease",
        "code": "CAD",
        "keywords": ["coronary artery disease", "cad", "coronary heart disease", "chd",
                      "coronary atherosclerosis", "blocked arteries", "coronary blockage",
                      "ischemic heart disease", "ihd"],
        "region": "Coronary Arteries",
        "unity_object": "heart_coronary_arteries",
        "description": "Narrowing or blockage of coronary arteries"
    },

    # Septal defects
    {
        "name": "Ventricular Septal Defect",
        "code": "VSD",
        "keywords": ["ventricular septal defect", "vsd", "hole in heart",
                      "interventricular septal defect"],
        "region": "Septum",
        "unity_object": "heart_septum",
        "description": "Hole in the wall separating the ventricles"
    },
    {
        "name": "Atrial Septal Defect",
        "code": "ASD",
        "keywords": ["atrial septal defect", "asd", "interatrial septal defect",
                      "hole between atria"],
        "region": "Septum",
        "unity_object": "heart_septum",
        "description": "Hole in the wall separating the atria"
    },

    # Cardiomyopathy
    {
        "name": "Dilated Cardiomyopathy",
        "code": "DCM",
        "keywords": ["dilated cardiomyopathy", "dcm", "enlarged heart",
                      "cardiomegaly", "dilated heart"],
        "region": "Left Ventricle",
        "unity_object": "heart_left_ventricle",
        "description": "Heart chambers enlarge and weaken"
    },
    {
        "name": "Hypertrophic Cardiomyopathy",
        "code": "HCM",
        "keywords": ["hypertrophic cardiomyopathy", "hcm", "hocm",
                      "hypertrophic obstructive cardiomyopathy", "ihss",
                      "asymmetric septal hypertrophy"],
        "region": "Septum",
        "unity_object": "heart_septum",
        "description": "Abnormal thickening of heart muscle, especially the septum"
    },
]

# Severity keywords for classification
SEVERITY_KEYWORDS = {
    "mild": ["mild", "trace", "trivial", "slight", "minimal", "grade 1", "grade i", "1+"],
    "moderate": ["moderate", "grade 2", "grade ii", "2+", "moderately"],
    "severe": ["severe", "critical", "significant", "marked", "grade 3", "grade 4",
               "grade iii", "grade iv", "3+", "4+", "severely", "advanced"],
}
