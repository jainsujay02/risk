
// src/App.jsx
// RiskAssessmentApp – minimal yet more sophisticated 🌿
//
// - Tailwind-CDN styling only
// - Modality filter, mitigation check-boxes, dynamic severity & dataset score
// ---------------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';


import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  doc,
  getDoc,
} from 'firebase/firestore';

import { db, DATASETS_COL } from './firebase';

import DatasetRiskFramework from "./DatasetRiskFramework";   //  ← NEW

import Header from "./Header";
import Landing from "./Landing";
import About from "./About";

/* ------------------------------------------------------------------ */
/* ★★ 1. MASTER CHECKLIST (now with `modality`)                       */
/* ------------------------------------------------------------------ */

/* ----------------------  shared helpers  ---------------------- */

/** rows that matter for a particular dataset (modality + region logic) */
const applicableRows = (ds) =>
  masterChecklist.filter((it) => {
    const modalityOK =
      it.modality === 'Universal' || (ds.modalities || []).includes(it.modality);
    const regionOK =
      it.region === 'Universal' || (ds.regions || []).includes(it.region);
    return modalityOK && regionOK;
  });

/** mean effective-severity of the dataset (uses only answered rows) */
const computeScore = (ds) => {
  const rows = applicableRows(ds);
  let total = 0;
  let answered = 0;

  rows.forEach((it) => {
    const r = (ds.risk || {})[it.id] || {};
    if (!r.answer) return;          // skip unanswered
    const base = sevNum[it.severity] || 2;
    const eff  = Object.values(r.boxes || {}).some(Boolean) ? base * 0.5 : base;
    total += eff;
    answered += 1;
  });

  return answered ? total / answered : 0;
};

export const masterChecklist = [
  /* ──────────── UNIVERSAL CORE (no country references) ─────────────── */
  {
    id: 'privacy_identifiers',
    modality: 'Universal',
    category: 'Privacy & Identifiability',
    region: 'Universal',
    question:
      'Does the dataset contain any direct identifiers (names, dates of birth, medical record numbers, faces, voices)?',
    answerType: 'yesno',
    options: ['Yes', 'No'],
    guidance:
      'Direct identifiers are high-risk personal data and must be removed or obfuscated before sharing.',
    recMitigation: [
      'Strip all DICOM / EXIF tags',
      'OCR check for burned-in text',
      'Deface faces or crop external anatomy',
      'Remove or mute audio tracks',
    ],
    severity: 'High',
    refs: 'Global de-identification best practice',
  },
  {
    id: 'reidentification_risk',
    modality: 'Universal',
    category: 'Re-identification Risk',
    region: 'Universal',
    question:
      'Could individuals be re-identified via latent markers or linkage with external data?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'Uncertain'],
    guidance:
      'Examples: facial outlines in MRI, unique retinal vessels, AI prediction of demographics from images.',
    recMitigation: [
      'Deface / crop risk areas',
      'Quantitative assessment (k-anonymity, δ-presence, etc.)',
      'Data-use agreement prohibiting re-ID attempts',
    ],
    severity: 'High',
    refs: 'Anonymisation risk frameworks',
  },
  {
    id: 'consent_governance',
    modality: 'Universal',
    category: 'Consent & Governance',
    region: 'Universal',
    question: 'Is appropriate participant consent or ethics/IRB waiver documented?',
    answerType: 'multichoice',
    options: ['Informed consent', 'IRB/Ethics waiver', 'Public/open data', 'No consent'],
    guidance:
      'Human-subject imaging data generally require either explicit consent or a documented waiver.',
    recMitigation: [
      'Obtain consent',
      'Secure ethics board approval or waiver',
      'Record dataset provenance & data-use terms',
    ],
    severity: 'High',
    refs: 'Ethical principles for medical data',
  },
  {
    id: 'bias_demographic',
    modality: 'Universal',
    category: 'Demographic Bias & Fairness',
    region: 'Universal',
    question:
      'Does the dataset adequately represent age, sex, ethnicity and geography for the intended use?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'Partial'],
    guidance:
      'Skewed datasets can lead to disparate model performance; representation should reflect target population.',
    recMitigation: [
      'Report demographic composition',
      'Augment under-represented groups',
      'Evaluate performance by subgroup',
    ],
    severity: 'Medium-High',
    refs: 'Fairness in medical-AI guidance',
  },
  {
    id: 'data_quality',
    modality: 'Universal',
    category: 'Data Quality & Integrity',
    region: 'Universal',
    question: 'Any quality issues (artifacts, corrupt files, noisy labels)?',
    answerType: 'yesno',
    options: ['Yes', 'No'],
    guidance:
      'Artifacts or label noise can materially degrade model accuracy and reliability.',
    recMitigation: [
      'Automated quality-control filters',
      'Multi-reader or adjudicated labelling',
      'Random sample audit',
    ],
    severity: 'Medium',
    refs: 'Best practice QC literature',
  },
  {
    id: 'misuse_potential',
    modality: 'Universal',
    category: 'Misuse & Ethical Concerns',
    region: 'Universal',
    question:
      'Could the dataset or resulting models enable harmful or unethical uses?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'Uncertain'],
    guidance:
      'Examples: predicting sensitive demographics for discrimination, generating deep-fakes, or identity inference.',
    recMitigation: [
      'Restrictive licence / data-use agreement',
      'Explicit ethics statement',
      'Monitor downstream usage',
    ],
    severity: 'Medium',
    refs: 'WHO / UNESCO AI ethics reports',
  },
  {
    id: 'data_documentation',
    modality: 'Universal',
    category: 'Data Governance & Documentation',
    region: 'Universal',
    question: 'Is a comprehensive data-sheet / documentation available?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'Partial'],
    guidance:
      'Transparent documentation improves reproducibility and regulatory acceptance.',
    recMitigation: [
      'Publish or update a data-card / datasheet',
      'Include source, demographics, preprocessing and limitations',
    ],
    severity: 'Low',
    refs: 'Datasheets for Datasets (2018)',
  },

  /* ──────────── REGION-SPECIFIC LEGAL ROWS ──────────────────────────── */
  {
    id: 'legal_compliance_usa',
    modality: 'Universal',
    category: 'Legal & Regulatory – USA',
    region: 'USA',
    question:
      'Dataset complies with HIPAA de-identification, Common Rule (45 CFR §46) and FDA GMLP expectations?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'Partial'],
    guidance:
      'Include Safe-Harbor or Expert-Determination de-identification, IRB authorisation where required, and traceability for device submissions.',
    recMitigation: [
      'Legal review',
      'Remove residual PHI',
      'Prepare FDA traceability documents',
    ],
    severity: 'High',
    refs: 'HIPAA; FDA GMLP 2021',
  },
  {
    id: 'legal_compliance_eu',
    modality: 'Universal',
    category: 'Legal & Regulatory – EU',
    region: 'EU',
    question:
      'Dataset meets GDPR & Medical Device Regulation (MDR) requirements (special-category data handling, RoPA, DPIA)?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'Partial'],
    guidance:
      'Health data are “special-category” under Art 9 GDPR; lawful basis, Data Processing Agreement and risk assessment (DPIA) required.',
    recMitigation: [
      'Conduct DPIA',
      'Execute DPA with controller',
      'Pseudonymise & record in RoPA',
    ],
    severity: 'High',
    refs: 'GDPR Art 9; EU MDR 2017/745',
  },
  {
    id: 'legal_compliance_india',
    modality: 'Universal',
    category: 'Legal & Regulatory – India',
    region: 'India',
    question:
      'Dataset aligns with the Digital Personal Data Protection (DPDP) Act 2023 and (if prenatal) PNDT 1994?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'Partial'],
    guidance:
      'Health data are “sensitive personal data”; PNDT bans disclosure of fetal sex.',
    recMitigation: [
      'Remove personal identifiers',
      'Implement localisation / cross-border safeguards where required',
      'Strip fetal-sex fields',
    ],
    severity: 'High',
    refs: 'DPDP 2023; PNDT 1994',
  },
  {
    id: 'gdpr_data_transfer',
    modality: 'Universal',
    category: 'Legal – EU International Transfer',
    region: 'EU',
    question:
      'If personal data leave the EEA, are Standard Contractual Clauses (SCC) or adequacy decisions in place?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'N/A'],
    guidance:
      'GDPR Art 46 requires appropriate safeguards for transfers to third countries.',
    recMitigation: [
      'Adopt SCCs',
      'Use an adequacy-listed country',
      'Rely on EU–US Data-Privacy Framework where applicable',
    ],
    severity: 'Medium',
    refs: 'GDPR Art 44-46',
  },
  {
    id: 'dpdp_localisation',
    modality: 'Universal',
    category: 'Legal – India Local Storage',
    region: 'India',
    question:
      'Does Indian regulation require local storage or mirroring of health data?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'N/A'],
    guidance:
      'Sectoral rules may mandate localisation even when the DPDP Act allows export.',
    recMitigation: [
      'Store primary copy in India',
      'Use in-country cloud region',
    ],
    severity: 'Medium',
    refs: 'MeitY localisation drafts 2022',
  },
  {
    id: 'mdr_clinical_eval',
    modality: 'Universal',
    category: 'Regulation – EU MDR Clinical Evaluation',
    region: 'EU',
    question:
      'If the dataset supports an AI software-as-medical-device, is MDR Annex XIV clinical-evaluation evidence planned?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'N/A'],
    guidance:
      'Clinical evidence and post-market follow-up are mandatory under MDR.',
    recMitigation: [
      'Plan clinical evaluation',
      'Define PMCF study using the dataset',
    ],
    severity: 'Medium',
    refs: 'EU MDR Annex XIV',
  },

  /* ──────────── MODALITY-SPECIFIC BLOCKS (unchanged except region tags) ─ */

  /* Radiology */
  {
    id: 'rad_faces',
    modality: 'Radiology',
    category: 'Radiology – Identifiable Anatomy',
    region: 'Universal',
    question: 'Do images include patient faces or tattoos not removed?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'N/A'],
    guidance:
      'Head CT/MRI often capture faces; visible tattoos can uniquely identify patients.',
    recMitigation: [
      'Automated defacing or deep-learning mask',
      'Manual QC of samples',
    ],
    severity: 'High',
    refs: 'Imaging de-identification studies',
  },
  {
    id: 'rad_dicom_meta',
    modality: 'Radiology',
    category: 'Radiology – Embedded Metadata',
    region: 'Universal',
    question: 'Have DICOM headers been fully anonymised (no patient tags remain)?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'N/A'],
    guidance:
      'Patient name, accession number or institution fields in DICOM violate privacy if present.',
    recMitigation: ['Certified DICOM anonymiser', 'Random file audit'],
    severity: 'High',
    refs: 'DICOM PS3.15',
  },
  {
    id: 'rad_pcpndt',
    modality: 'Radiology',
    category: 'Radiology – PNDT Compliance',
    region: 'India',
    question:
      'Does any prenatal ultrasound content comply with PNDT (no fetal-sex info)?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'N/A'],
    guidance: 'Indian PNDT Act forbids disclosure of fetal sex.',
    recMitigation: [
      'Remove sex labels',
      'Exclude genital views',
      'Controlled access to ultrasound clips',
    ],
    severity: 'High',
    refs: 'PCPNDT Act 1994',
  },
  {
    id: 'rad_device_bias',
    modality: 'Radiology',
    category: 'Radiology – Device / Protocol Bias',
    region: 'Universal',
    question:
      'Are multiple scanner vendors or protocols represented to avoid device bias?',
    answerType: 'yesno',
    options: ['Yes', 'No'],
    guidance:
      'Single-vendor data may not generalise; domain-shift risk for deployed models.',
    recMitigation: ['Include multi-site data', 'Domain adaptation / normalisation'],
    severity: 'Medium',
    refs: 'Cross-vendor generalisation studies',
  },
  {
    id: 'rad_incidental',
    modality: 'Radiology',
    category: 'Radiology – Incidental Findings',
    region: 'Universal',
    question: 'Are incidental findings handled or annotated consistently?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'N/A'],
    guidance:
      'NLP labelling may miss incidental lesions → noisy ground-truth.',
    recMitigation: [
      'Expert review of critical regions',
      'Document label source & uncertainty',
    ],
    severity: 'Low-Medium',
    refs: 'Radiology reporting guidelines',
  },

  /* Pathology */
  {
    id: 'path_slide_label',
    modality: 'Pathology',
    category: 'Pathology – Slide Label PHI',
    region: 'Universal',
    question: 'Are slide labels with patient identifiers visible?',
    answerType: 'yesno',
    options: ['Yes', 'No'],
    guidance: 'Label regions can contain patient names or IDs.',
    recMitigation: ['Crop / mask label strip', 'OCR to detect stray text'],
    severity: 'High',
    refs: 'Digital pathology de-ID guidance',
  },
  {
    id: 'path_metadata',
    modality: 'Pathology',
    category: 'Pathology – Patient Metadata',
    region: 'Universal',
    question: 'Are linked clinical metadata anonymised (e.g. age binned)?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'N/A'],
    guidance:
      'Fine-grained age or hospital IDs can re-identify; bin or remove.',
    recMitigation: [
      'Bin ages (e.g. five-year groups)',
      'Strip medical-record numbers',
      'Obtain consent for sensitive fields',
    ],
    severity: 'Medium',
    refs: 'Metadata anonymisation best practice',
  },
  {
    id: 'path_stain_variability',
    modality: 'Pathology',
    category: 'Pathology – Stain & Scanner Variability',
    region: 'Universal',
    question: 'Does the dataset account for stain or scanner variability?',
    answerType: 'yesno',
    options: ['Yes', 'No'],
    guidance:
      'Colour shift biases models; stain normalisation or augmentation needed.',
    recMitigation: [
      'Include multi-lab slides',
      'Apply stain normalisation (e.g. Macenko)',
    ],
    severity: 'Medium',
    refs: 'Histopathology domain-shift studies',
  },
  {
    id: 'path_dataset_bias',
    modality: 'Pathology',
    category: 'Pathology – Dataset Bias',
    region: 'Universal',
    question: 'Is over-representation of certain diseases or demographics documented?',
    answerType: 'yesno',
    options: ['Yes', 'No'],
    guidance:
      'Tertiary-care datasets may over-represent advanced or rare disease.',
    recMitigation: [
      'Document composition',
      'Augment or limit model claims',
    ],
    severity: 'Medium',
    refs: 'WHO AI equity reports',
  },
  {
    id: 'path_annotation_accuracy',
    modality: 'Pathology',
    category: 'Pathology – Annotation Accuracy',
    region: 'Universal',
    question: 'Are annotations verified by multiple pathologists or gold-standard?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'Uncertain'],
    guidance:
      'Single-annotator labels may include errors; inter-observer variability significant in pathology.',
    recMitigation: [
      'Consensus or adjudication',
      'Report label confidence / provenance',
    ],
    severity: 'Medium',
    refs: 'Gleason variability studies',
  },

  /* Ophthalmology */
  {
    id: 'oph_latent_info',
    modality: 'Ophthalmology',
    category: 'Ophthalmology – Hidden Health Info',
    region: 'Universal',
    question:
      'Retinal/OCT images could reveal unintended traits (age, sex, cardiovascular risk, etc.)?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'Uncertain'],
    guidance:
      'Fundus AI can predict age, sex, and systemic risk factors.',
    recMitigation: [
      'Warn users & include ethical statement',
      'Restrict downstream misuse',
      'Obtain consent for secondary analyses',
    ],
    severity: 'Medium',
    refs: 'Nature 2018 retina-risk study',
  },
  {
    id: 'oph_face_in_frame',
    modality: 'Ophthalmology',
    category: 'Ophthalmology – Identifiable Frame',
    region: 'Universal',
    question: 'Do any images include facial regions or identifying features?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'N/A'],
    guidance:
      'External eye photographs may reveal the face; fundus images usually do not.',
    recMitigation: ['Crop external views', 'Verify no printed names'],
    severity: 'Low',
    refs: 'Ophthalmic imaging privacy guidance',
  },
  {
    id: 'oph_clinical_context',
    modality: 'Ophthalmology',
    category: 'Ophthalmology – Clinical Context',
    region: 'Universal',
    question: 'Is acquisition context (eye side, disease stage) documented?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'Partial'],
    guidance:
      'Missing laterality or stage may lead to label noise and evaluation errors.',
    recMitigation: ['Include metadata fields', 'Patient-level split'],
    severity: 'Low',
    refs: 'EyePACS documentation',
  },

  /* Endoscopy */
  {
    id: 'endo_audio',
    modality: 'Endoscopy',
    category: 'Endoscopy – Audio Identifiers',
    region: 'Universal',
    question: 'Do videos contain audio with patient or staff identifiers?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'N/A'],
    guidance:
      'Names or voices can re-identify individuals; treat audio as sensitive.',
    recMitigation: [
      'Remove or mute audio',
      'Redact spoken names',
      'Voice distortion if speech essential',
    ],
    severity: 'High',
    refs: 'Audio PHI guidance',
  },
  {
    id: 'endo_external_view',
    modality: 'Endoscopy',
    category: 'Endoscopy – External Footage',
    region: 'Universal',
    question: 'Do any frames show patient face or external anatomy?',
    answerType: 'yesno',
    options: ['Yes', 'No'],
    guidance:
      'Intro frames or scope insertion can expose faces or identifying marks.',
    recMitigation: ['Trim intro frames', 'Blur external anatomy'],
    severity: 'High',
    refs: 'Endoscopy privacy best practice',
  },
  {
    id: 'endo_consent',
    modality: 'Endoscopy',
    category: 'Endoscopy – Consent',
    region: 'Universal',
    question: 'Is patient consent or IRB approval documented for video capture and research use?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'Unknown'],
    guidance:
      'Procedural video recording typically requires explicit informed consent or documented waiver.',
    recMitigation: ['Obtain consent', 'Secure IRB paperwork'],
    severity: 'High',
    refs: 'Endoscopic research ethics literature',
  },
  {
    id: 'endo_sensitive_scenes',
    modality: 'Endoscopy',
    category: 'Endoscopy – Sensitive Scenes',
    region: 'Universal',
    question: 'Could videos be misused or cause harm if publicly shared?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'Uncertain'],
    guidance:
      'Graphic internal images or rare pathologies may need controlled access.',
    recMitigation: ['Restrict access', 'Include content warnings'],
    severity: 'Medium',
    refs: 'WHO AI ethics 2021',
  },
  {
    id: 'endo_security',
    modality: 'Endoscopy',
    category: 'Endoscopy – Data Volume & Security',
    region: 'Universal',
    question: 'Are secure storage and transfer methods used for large video files?',
    answerType: 'yesno',
    options: ['Yes', 'No'],
    guidance:
      'Unencrypted drives or public links expose sensitive data.',
    recMitigation: ['Encrypt at rest and in transit', 'Audit access logs'],
    severity: 'Medium',
    refs: 'ISO 27001 best practice',
  },

  /* Dermatology */
  {
    id: 'derm_face_visible',
    modality: 'Dermatology',
    category: 'Dermatology – Identifiable Face / Tattoos',
    region: 'Universal',
    question: 'Do photos show full face, tattoos, or unique body art?',
    answerType: 'yesno',
    options: ['Yes', 'No'],
    guidance:
      'Faces and tattoos are direct identifiers in clinical imagery.',
    recMitigation: [
      'Crop / blur faces & tattoos',
      'Automatic face-masking',
      'Manual QC sample',
    ],
    severity: 'High',
    refs: 'Dermatology photo de-ID studies',
  },
  {
    id: 'derm_exif_geo',
    modality: 'Dermatology',
    category: 'Dermatology – EXIF / Location Metadata',
    region: 'Universal',
    question: 'Are GPS coordinates or device IDs preserved in EXIF headers?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'N/A'],
    guidance:
      'Smartphone cameras embed latitude/longitude and serial numbers by default.',
    recMitigation: ['Strip all EXIF metadata', 'Validate with exiftool'],
    severity: 'High',
    refs: 'NIH Photo De-ID Guidance 2021',
  },
  {
    id: 'derm_skin_tone_bias',
    modality: 'Dermatology',
    category: 'Dermatology – Skin-Tone Diversity',
    region: 'Universal',
    question: 'Does the dataset span Fitzpatrick I-VI skin types?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'Partial'],
    guidance:
      'Most public dermatology datasets over-represent lighter skin; leads to false negatives on darker tones.',
    recMitigation: [
      'Augment or collect darker skin samples',
      'Report stratified performance',
    ],
    severity: 'Medium-High',
    refs: 'Nature Med 2022 skin-tone gap',
  },
  {
    id: 'derm_colour_calibration',
    modality: 'Dermatology',
    category: 'Dermatology – Colour Calibration & Lighting',
    region: 'Universal',
    question: 'Is colour calibration or lighting variability documented?',
    answerType: 'yesno',
    options: ['Yes', 'No'],
    guidance:
      'Inconsistent lighting alters lesion appearance; colour calibration improves robustness.',
    recMitigation: [
      'Capture with colour-checker card',
      'Apply colour or illumination normalisation',
    ],
    severity: 'Medium',
    refs: 'IEEE JBHI 2020 derm standards',
  },

  /* Surgery / intra-operative video */
  {
    id: 'surg_or_faces_audio',
    modality: 'Surgery',
    category: 'Surgery Video – Staff Faces & Audio',
    region: 'Universal',
    question:
      'Do videos include surgical team faces, name badges, or audible names?',
    answerType: 'yesno',
    options: ['Yes', 'No'],
    guidance:
      'Operating-room footage often reveals staff identities and spoken names.',
    recMitigation: ['Blur faces/badges', 'Mute or redact audio'],
    severity: 'High',
    refs: 'OR privacy studies',
  },
  {
    id: 'surg_patient_body',
    modality: 'Surgery',
    category: 'Surgery Video – External Patient Anatomy',
    region: 'Universal',
    question:
      'Are external patient views present before draping (face, tattoos, etc.)?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'N/A'],
    guidance:
      'Prep and drape shots may reveal patient identity.',
    recMitigation: ['Trim to intra-cavity segments', 'Blur exposed skin'],
    severity: 'High',
    refs: 'Surgical video privacy reviews',
  },
  {
    id: 'surg_industry_ip',
    modality: 'Surgery',
    category: 'Surgery Video – Proprietary UI / IP',
    region: 'Universal',
    question:
      'Do videos display proprietary robotic or device UIs that are copyrighted?',
    answerType: 'yesno',
    options: ['Yes', 'No'],
    guidance:
      'Manufacturers may restrict redistribution of logos or overlays.',
    recMitigation: ['Crop UI overlay', 'Obtain vendor licence'],
    severity: 'Medium',
    refs: 'Vendor IP notices',
  },
  {
    id: 'surg_graphic_content',
    modality: 'Surgery',
    category: 'Surgery Video – Graphic Content',
    region: 'Universal',
    question:
      'Could graphic scenes cause harm or require content warnings if shared publicly?',
    answerType: 'yesno',
    options: ['Yes', 'No', 'Uncertain'],
    guidance:
      'Graphic content may violate platform policies or distress viewers.',
    recMitigation: ['Add content warnings', 'Restrict to credentialled users'],
    severity: 'Medium',
    refs: 'Platform medical-content rules',
  },
  {
    id: 'surg_file_security',
    modality: 'Surgery',
    category: 'Surgery Video – File Size & Security',
    region: 'Universal',
    question:
      'Are raw (>100 GB) videos stored or transferred with encryption and access logs?',
    answerType: 'yesno',
    options: ['Yes', 'No'],
    guidance:
      'Large unencrypted files on portable drives pose breach risks.',
    recMitigation: [
      'Encrypt at rest (AES-256)',
      'Use managed object storage with audit trail',
    ],
    severity: 'Medium',
    refs: 'ISO 27001 best practice',
  },
];


/* Map severity string → numeric value */
const sevNum   = { Low: 1, 'Low-Medium': 1.5, Medium: 2, 'Medium-High': 2.5, High: 3 };
// colour band now keys off the same ≥ 2 rule
const sevBand = (n) =>
  n >= 1.9    ? { label: 'High',   cls: 'bg-red-500'   } :
  n >= 1.5  ? { label: 'Medium', cls: 'bg-amber-400' } :
              { label: 'Low',    cls: 'bg-green-500' };

// helper that turns a numeric score into the text label
const riskLabel = (n) => (n >= 1.9 ? 'High' : n >= 1.5 ? 'Medium' : 'Low');
/* ------------------------------------------------------------------ */
/* ★★ 2. DEFAULT DATASETS (same as before, keep full risk objects)    */
/* ------------------------------------------------------------------ */
const defaultDatasets = [
  /* … YOUR FULL DETAILED OBJECTS (MIMIC-CXR & OpenPath) … */
];

/* ------------------------------------------------------------------ */
/* ★★ 3. small components                                             */
/* ------------------------------------------------------------------ */
const Pill = ({ value }) => {
  const { label, cls } = sevBand(value);
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs text-white ${cls}`}>
      {label}
    </span>
  );
};

const YesNoSelect = ({ value, onChange, options }) => (
  <select
    className="border rounded px-2 py-1"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    required
  >
    <option value="">—</option>
    {options.map((o) => (
      <option key={o}>{o}</option>
    ))}
  </select>
);

/* ------------------------------------------------------------------ */
/* ★★ 4. Dataset list                                                 */
/* ------------------------------------------------------------------ */
function DatasetList() {
  const [data, setData] = useState([]);
   useEffect(() => {
   // real-time listener – updates table as soon as anything changes
   const unsub = onSnapshot(collection(db, DATASETS_COL), snap =>
     setData(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
   );
   return unsub;              // clean up on unmount
 }, []);

  const scoreFor = computeScore;

  return (
    <div className="p-8 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Medical-Imaging Datasets</h1>
        <Link
          to="/add"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          + New
        </Link>
      </header>

      <div className="overflow-x-auto shadow rounded bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="p-3 text-left font-medium">Dataset</th>
              <th className="p-3 text-left font-medium">Description</th>
              <th className="p-3 text-left font-medium">Source</th>
              <th className="p-3 text-left font-medium">Risk Score</th>
              <th className="p-3 text-left font-medium">Risk Card</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => {
              const score = computeScore(d);
              return (
                <tr key={d.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-semibold">{d.name}</td>
                  <td className="p-3 max-w-xs truncate" title={d.description}>
                    {d.description}
                  </td>
                  <td className="p-3">
                    <a
                      className="text-blue-600 underline"
                      href={d.source}
                      target="_blank"
                    >
                      link
                    </a>
                  </td>
                  <td className="p-3">
  {score ? (
    <div className="flex flex-col items-start leading-tight">
      <Pill value={score} />
      <span className="text-xs text-gray-600 mt-0.5">
        {score.toFixed(2)}
      </span>
    </div>
  ) : '—'}
</td>

                  <td className="p-3">
                    <Link className="text-blue-600 underline" to={`/dataset/${d.id}`}>
                      view
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ★★ 5. Add-dataset form                                             */
/* ------------------------------------------------------------------ */
const MODS = [
  'Radiology',
  'Pathology',
  'Ophthalmology',
  'Endoscopy',
  'Dermatology',
  'Surgery',
];

const REGIONS = ['USA', 'EU', 'India'];


function AddDataset() {
  const nav = useNavigate();
  const [meta, setMeta] = useState({
    name: '',
    description: '',
    source: '',
    modalities: [],
    regions: [],
  });

  // answers structure
  const initRisk = () =>
    Object.fromEntries(
      masterChecklist.map((it) => [
        it.id,
        {
          answer: '',
          boxes: Object.fromEntries((it.recMitigation || []).map((m) => [m, false])),
          notes: '',
        },
      ]),
    );
  const [risk, setRisk] = useState(initRisk);

  // convenience
  const toggleMod = (m) =>
    setMeta((p) => ({
      ...p,
      modalities: p.modalities.includes(m)
        ? p.modalities.filter((x) => x !== m)
        : [...p.modalities, m],
    }));

  const setAns = (id, val) => setRisk((p) => ({ ...p, [id]: { ...p[id], answer: val } }));
  const toggleBox = (id, label) =>
    setRisk((p) => ({
      ...p,
      [id]: {
        ...p[id],
        boxes: { ...p[id].boxes, [label]: !p[id].boxes[label] },
      },
    }));
  const setNote = (id, val) => setRisk((p) => ({ ...p, [id]: { ...p[id], notes: val } }));


const submit = async (e) => {
   e.preventDefault();
   if (!meta.name || !meta.source) return alert('Name & source required');

   // Firestore lets us keep risk, modalities, regions exactly as you built them
   await addDoc(collection(db, DATASETS_COL), {
     ...meta,
     createdAt: serverTimestamp(),
     risk,
   });
   nav('/');
 };

  // which rows to show

const rows = applicableRows(meta);
  return (
    <div className="p-8 mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold mb-6">New Dataset</h1>

      <form onSubmit={submit} className="space-y-8">
        {/* meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-medium">Dataset Name *</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={meta.name}
              onChange={(e) => setMeta({ ...meta, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium">Source URL *</label>
            <input
              type="url"
              className="border rounded px-3 py-2 w-full"
              value={meta.source}
              onChange={(e) => setMeta({ ...meta, source: e.target.value })}
              required
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="font-medium">Description</label>
            <textarea
              className="border rounded px-3 py-2 w-full h-24"
              value={meta.description}
              onChange={(e) => setMeta({ ...meta, description: e.target.value })}
            />
          </div>
        </div>

        {/* modalities */}
        <div className="space-y-2">
          <label className="font-medium">Modalities present in this dataset</label>
          <div className="flex flex-wrap gap-4">
            {MODS.map((m) => (
              <label key={m} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={meta.modalities.includes(m)}
                  onChange={() => toggleMod(m)}
                />
                {m}
              </label>
            ))}
          </div>
        </div>

        {/* regions */}
<div className="space-y-2">
  <label className="font-medium">
    Applicable jurisdictions (select ≥ 1)
  </label>
  <div className="flex flex-wrap gap-4">
    {REGIONS.map((r) => (
      <label key={r} className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={meta.regions?.includes(r)}
          onChange={() =>
            setMeta((p) => ({
              ...p,
              regions: p.regions?.includes(r)
                ? p.regions.filter((x) => x !== r)
                : [...(p.regions || []), r],
            }))
          }
        />
        {r}
      </label>
    ))}
  </div>
</div>


        {/* checklist */}
        <div className="border rounded p-4 max-h-[60vh] overflow-y-auto bg-gray-50">
          <h2 className="font-semibold mb-4">
            Risk Checklist <span className="text-gray-600">({rows.length} rows)</span>
          </h2>

          {rows.map((it) => {
            const r = risk[it.id];
            const answered = !!r.answer;
            const mitigated = Object.values(r.boxes).some(Boolean);
            const eff = answered
              ? (sevNum[it.severity] || 2) * (mitigated ? 0.5 : 1)
              : 0;
            return (
              <div key={it.id} className="bg-white shadow-sm rounded p-4 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm mb-1">
                      <span className="italic text-gray-500">{it.category}</span> –{' '}
                      {it.question}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">{it.guidance}</p>
                  </div>
                  {answered && <Pill value={eff} />}
                </div>

                {/* answer & mitigations */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-24">Answer:</span>
                    {it.answerType === 'multichoice' ? (
                      <select
                        className="border rounded px-2 py-1"
                        value={r.answer}
                        onChange={(e) => setAns(it.id, e.target.value)}
                        required
                      >
                        <option value="">—</option>
                        {it.options.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <YesNoSelect
                        value={r.answer}
                        onChange={(v) => setAns(it.id, v)}
                        options={it.options || ['Yes', 'No', 'Uncertain']}
                      />
                    )}
                  </div>

                  {it.recMitigation?.length > 0 && (
                    <div className="text-sm space-y-1">
                      <p className="font-medium">Recommended mitigations:</p>
                      {it.recMitigation.map((m) => (
                        <label key={m} className="flex items-center gap-2 ml-4">
                          <input
                            type="checkbox"
                            checked={r.boxes[m]}
                            onChange={() => toggleBox(it.id, m)}
                          />
                          {m}
                        </label>
                      ))}
                    </div>
                  )}

                  <textarea
                    className="border rounded px-2 py-1 w-full text-sm"
                    placeholder="Mitigation notes / comments"
                    value={r.notes}
                    onChange={(e) => setNote(it.id, e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          type="submit"
        >
          Save Dataset
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ★★ 6. Dataset profile                                             */
/* ------------------------------------------------------------------ */
function RiskProfile() {
  const { id } = useParams();
const [ds, setDs] = useState(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   getDoc(doc(collection(db, DATASETS_COL), id)).then(snap => {
     if (snap.exists()) setDs({ id: snap.id, ...snap.data() });
     setLoading(false);
   });
 }, [id]);

 if (loading) return <div className="p-8">Loading…</div>;
 if (!ds)     return <div className="p-8">Dataset not found.</div>;

const rows  = applicableRows(ds);
const score = computeScore(ds);
  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold flex items-center gap-4">
          {ds.name} <Pill value={score} />{' '}
          <span className="text-sm text-gray-500">({score.toFixed(2)})</span>
        </h1>
        <p className="text-gray-700">{ds.description}</p>
        <a href={ds.source} className="text-blue-600 underline" target="_blank">
          dataset link
        </a>
      </div>

      <div className="overflow-x-auto shadow rounded bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="p-3">Category</th>
              <th className="p-3">Question</th>
              <th className="p-3">Answer</th>
              <th className="p-3">Mitigations</th>
              <th className="p-3">Notes</th>
              <th className="p-3">Severity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((it) => {
              const r = ds.risk[it.id] || {};
              const base = sevNum[it.severity] || 2;
              const eff = Object.values(r.boxes || {}).some(Boolean)
                ? base * 0.5
                : base;
              return (
                <tr key={it.id} className="border-b">
                  <td className="p-3 whitespace-nowrap">{it.category}</td>
                  <td className="p-3">{it.question}</td>
                  <td className="p-3">{r.answer || '—'}</td>
                  <td className="p-3 max-w-xs">
                    {(r.boxes &&
                      Object.entries(r.boxes)
                        .filter(([, v]) => v)
                        .map(([k]) => k)
                        .join(', ')) ||
                      '—'}
                  </td>
                  <td className="p-3">{r.notes || '—'}</td>
                  <td className="p-3">
                    <Pill value={eff} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ★★ 7. App root                                                     */
/* ------------------------------------------------------------------ */
export default function App() {
  return (
    <Router>
      <Header />   {/* ← new */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/datasets" element={<DatasetList />} />
        <Route path="/add" element={<AddDataset />} />
        <Route path="/dataset/:id" element={<RiskProfile />} />
        <Route path="/framework" element={<DatasetRiskFramework />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}
