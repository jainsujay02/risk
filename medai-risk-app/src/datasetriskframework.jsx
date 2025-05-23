/* top-level in datasetriskframework.jsx */
let index;

import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { oaicite } from "./citations";


export const Cite = ({ i }) => (
  <sup className="align-super mx-0.5">
    <a
      href={oaicite[i].url}
      title={oaicite[i].title}
      target="_blank"
      rel="noreferrer"
    >
      {i + 1}
    </a>
  </sup>
);

const P = ({ children }) => (
  <p className="mb-4 last:mb-0">   {/* last:mb-0 = no gap after the final <p> */}
    {children}
  </p>
);
/* ------------ 1 ▪ tiny utility wrappers so we get nice defaults ----- */

const Accordion       = ({ children, ...p }) => (
  <AccordionPrimitive.Root {...p}>{children}</AccordionPrimitive.Root>
);
const AccordionItem   = AccordionPrimitive.Item;

const AccordionTrigger = React.forwardRef(({ children, className = "", ...p }, ref) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      ref={ref}
      {...p}
      className={
        "w-full flex justify-between items-center py-3 text-left font-medium " +
        "hover:underline data-[state=open]:text-blue-600 " + className
      }
    >
      {children}
      {/* caret icon */}
      <svg
        className="ml-2 transition-transform duration-200 data-[state=open]:rotate-180"
        width="16"
        height="16"
        viewBox="0 0 24 24"
      >
        <path fill="currentColor" d="M12 15.5 5 8.5 6.4 7l5.6 5.6L17.6 7 19 8.5z" />
      </svg>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

const AccordionContent = ({ children, className = "", ...p }) => (
  <AccordionPrimitive.Content
    {...p}
    className={
      "overflow-hidden data-[state=closed]:animate-slideUp " +
      "data-[state=open]:animate-slideDown " + className
    }
  >
    <div className="pb-4 text-sm leading-relaxed">{children}</div>
  </AccordionPrimitive.Content>
);

/* -- Tabs (same idea) -------------------------------------------------- */

const Tabs            = TabsPrimitive.Root;
const TabsList        = ({ className = "", ...p }) => (
  <TabsPrimitive.List
    {...p}
    className={"inline-flex border-b mb-4 space-x-1 " + className}
  />
);
const TabsTrigger     = ({ children, value, className = "", ...p }) => (
  <TabsPrimitive.Trigger
    value={value}
    {...p}
    className={
      "px-4 py-1 rounded-t border bg-gray-100 data-[state=active]:bg-white " +
      "data-[state=active]:border-b-transparent " + className
    }
  >
    {children}
  </TabsPrimitive.Trigger>
);
const TabsContent     = TabsPrimitive.Content;

/* ------------ 2 ▪ the **very long** body you already wrote ----------- */
/* (exactly as-is; nothing changed except the import names)              */


export default function DatasetRiskFramework() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Accordion type="multiple" className="space-y-4">
        <AccordionItem value="intro">
          <AccordionTrigger className="text-xl font-semibold">1. Introduction</AccordionTrigger>
          <AccordionContent>
            <p>
              Artificial intelligence holds immense promise for healthcare, but dataset issues can quickly undermine trust. If AI systems are trained on flawed or biased data, they may produce errors that harm patients and erode confidence<Cite i={0} />. High-profile calls from regulators and organizations stress that managing data quality, bias, and privacy is critical to safe AI in medicine<Cite i={1} />. A robust dataset-level risk framework therefore lays the foundation for <em>trustworthy</em> medical AI by ensuring that the data feeding our algorithms is handled with the same rigor as the models themselves. This introduction explains why a comprehensive framework for dataset risk is essential to realizing AI’s benefits in healthcare while safeguarding patients and upholding ethical standards.
            </p>
            <br></br>
            <p>
              Unlike a simple checklist of dos and don’ts, a dataset risk framework digs into the <strong>“why”</strong>: Why must we worry about seemingly mundane details like how an imaging dataset was collected, annotated, or de-identified? The answer is that real-world experience (and research) has shown data problems to be at the root of many AI failures and ethical lapses. When a medical AI model behaves unexpectedly or unfairly, often “dataset debt” is the culprit – hidden biases, missing patient consent, poor image quality, or other data issues planted the seeds of downstream risk. By systematically identifying these risk factors and referencing evidence – from regulatory guidelines to empirical studies – we can justify each component of a medical AI dataset risk assessment. The sections below walk through the core risk categories that apply universally, then drill down into jurisdiction-specific legal considerations, modality-specific factors, and broader societal risks that go beyond the obvious.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="core">
          <AccordionTrigger className="text-xl font-semibold">2. Universal Core Risk Categories</AccordionTrigger>
          <AccordionContent>
            <h3 className="mt-4 font-semibold">Privacy and Security of Data</h3>
            <p>
              <strong>Privacy:</strong> Medical imaging datasets often contain sensitive personal information, so protecting patient privacy is paramount. In fact, regulations like HIPAA count full-face photographs and comparable images (e.g. identifiable patient faces in MRI or dermatology photos) as direct identifiers that must be removed or obscured in de-identified data<Cite i={2} />. Even when obvious identifiers are removed, recent studies show imaging data can still jeopardize privacy. For example, a 2024 experiment reconstructed realistic 3D faces from head MRI scans and then matched 50% of participants to online photos within minutes using facial recognition<Cite i={3} /><Cite i={4} />. This demonstrates that “anonymized” scans can be re-identified with widely available AI tools, posing a serious privacy risk. Another study found that machine learning could re-identify up to 85% of individuals from a supposedly de-identified dataset by cross-linking information<Cite i={5} />. These findings underscore why strict privacy safeguards (e.g. de-facing algorithms, data use agreements) are a core element of dataset risk management.
            </p>
                        <br></br>

            <p>
              <strong>Security:</strong> Hand in hand with privacy is data security – preventing unauthorized access or tampering. Healthcare data has become a prime target for cyberattacks due to its high value. A 2020 investigation revealed over 45 million medical images (X-rays, CTs, MRIs) stored on unsecured servers worldwide, many with 200+ lines of metadata containing patient names, birthdates, and diagnoses, all accessible with no login<Cite i={6} />. Such lapses enable identity theft, ransomware, or blackmail using private health information<Cite i={7} />. Beyond data leaks, there’s also the risk of malicious manipulation. Researchers have shown that “adversarial attacks” on medical images can trick AI models (and even human doctors) into misdiagnosis<Cite i={8} />. For instance, subtle alterations to a CT or mammogram image might cause an AI to miss a cancer that is actually present, or vice versa. These security threats mean dataset risk assessments must consider how data is stored, transmitted, and protected, as well as the integrity of the images themselves (e.g. using watermarking or checksums to detect tampering). Robust security controls and monitoring are therefore universal requirements for trustworthy medical AI datasets.
            </p>

            <h3 className="mt-4 font-semibold">Consent and Ethical Data Use</h3>
            <p>
              Using patient data for AI requires careful attention to informed consent and ethical oversight. In research contexts, Institutional Review Boards (IRBs) insist on either obtaining patients’ informed consent or a waiver that the data use has minimal risk. But even outside formal research, patients expect autonomy over how their health data is used<Cite i={9} />. Problems arise when organizations repurpose or share data without patients’ knowledge or consent. For example, in the United States, media investigations found that a major hospital system (the Mayo Clinic) licensed de-identified patient data to AI companies without notifying patients<Cite i={10} />. While the data might have been technically de-identified, the lack of transparency sparked public concern over “data monetization” without consent.
            </p>
                        <br></br>

            <p>
              Ethical AI frameworks (such as the WHO’s guidance on AI ethics) emphasize that patients should have agency in how their data is used and that data usage should align with patients’ expectations<Cite i={11} />. When consent is obtained, it should be explicit and specific – patients deserve to know if their X-rays or pathology slides might be used to develop commercial AI tools, for instance. Strong governance policies can help: data use agreements, data access committees, and regular audits can ensure that even once consent is given, the data isn’t later misused beyond the agreed scope. In summary, respecting patient consent and privacy preferences isn’t just a legal checkbox – it’s fundamental to maintaining trust and upholding medical ethics in AI development.
            </p>

            <h3 className="mt-4 font-semibold">Bias and Fairness</h3>
            <p>
              Data bias is one of the most scrutinized risk domains in medical AI, and for good reason: biased datasets lead to biased models, which can translate into poorer care for under-represented groups. The World Health Organization explicitly warns that AI trained on unbalanced data can produce misleading or inaccurate results that pose risks to health equity<Cite i={12} />. In practice, many medical AI tools have stumbled on this issue. A growing body of evidence shows that if a training dataset under-represents certain populations (e.g. racial minorities, women, or elders), the resulting model often performs worse for those groups<Cite i={13} />. This has been observed across modalities – from dermatology algorithms that are less accurate on darker skin tones, to radiology models that under-detect findings in patients of certain ethnicities.
            </p>
                        <br></br>

            <p>
              A real-world example comes from dermatology: analyses of dermatology image datasets and textbooks reveal a serious skin-type representation gap. One study introduced an AI tool (STAR-ED) to measure skin-tone diversity in medical images and found that images with dark skin (Fitzpatrick skin types V–VI) made up only about 10% or less of content<Cite i={14} />. This under-representation correlates with known disparities – melanoma, for instance, is often diagnosed at a later stage in black and brown-skinned patients, in part because doctors (and AI systems) have less exposure to what diseases look like on darker tones<Cite i={15} />.
            </p>
                        <br></br>

            <p>
              <Cite i={16} /> *Figure:* An automated analysis of four major dermatology textbooks found that images of darker skin tones (Fitzpatrick V–VI, maroon bars) comprised only ~5–10% of images, with ~90–95% of images showing light/medium skin (purple bars). This data (ground truth “GT” vs. AI estimates) highlights a substantial representation bias in educational materials<Cite i={17} /><Cite i={18} />. Such biases in source data can lead to AI tools that systematically underperform for patients with dark skin, exacerbating healthcare disparities.
            </p>
            <p>
              Bias can take many forms: **sampling bias** (collecting data from a population that doesn’t reflect the target patient group), **annotation bias** (systematic labeling errors or inconsistencies, often due to subjective judgments), and **omission bias** (missing relevant subgroups or features in the data). For example, if an ophthalmology AI is trained mostly on younger adult retinal images, it may not perform well on geriatric patients – an <em>age bias</em> due to sampling. Likewise, if radiologists label fractures more aggressively in male patient scans than female (perhaps due to implicit assumptions), a gender bias could be introduced in the training labels. The key point is that dataset curation must proactively check for these biases. Techniques include ensuring diverse demographics in the dataset, performing stratified performance evaluations (does the model do equally well for men vs women, one hospital vs another?), and documenting any imbalances so they can be addressed. Bias mitigation is not only an ethical imperative but increasingly a regulatory expectation: even the FDA now asks medical AI developers to include plans for identifying and reducing algorithmic bias during the submission process<Cite i={19} />.
            </p>

            <h3 className="mt-4 font-semibold">Data Quality and Integrity</h3>
            <p>
              The old adage “garbage in, garbage out” applies in full force to medical AI. Data quality issues – like poor image resolution, incorrect or noisy labels, class imbalance, or technical artifacts – can severely impact model performance and even patient safety. For instance, if half the MRI scans in a training set have motion blur or scanner artifacts, a model might learn to ignore subtle pathologies or become overconfident in low-quality images. In one case, researchers found some COVID-19 chest X-ray models appeared highly accurate until it was discovered that they were exploiting dataset artefacts (like certain hospitals’ text markers on images) rather than true disease features<Cite i={20} />. This happened because “Frankenstein” datasets were cobbled together from multiple sources without careful quality control, leading to data leakage and overly optimistic results<Cite i={21} />.
            </p>
                        <br></br>

            <p>
              Ensuring data integrity involves multiple best practices. First, datasets should be curated to have clear, correct labels (with expert validation or consensus for difficult cases) and sufficiently high resolution/quality for the task. Second, dataset splits (train/validation/test) must be done in a way that avoids information leakage – for example, no patient’s images should appear in both training and test sets<Cite i={22} />. If a dataset is updated over time, meticulous versioning is needed so that model developers know which data were used and can avoid inadvertently training and testing on overlapping data<Cite i={23} />. The METRIC guidelines (a data quality framework for medical AI) recommend assessing dimensions like completeness, consistency, and accuracy of data as part of risk evaluation<Cite i={24} />. In practice, this might include checking for missing data (are all images properly stored and readable?), verifying that data formats and annotations follow a standard, and quantifying inter-annotator agreement for labeled data. High-quality datasets also document any preprocessing steps (e.g. image normalization, artifact removal) to ensure these processes don’t introduce subtle biases. The bottom line: a dataset risk checklist should enforce that the data is “fit for purpose” – appropriately clean, accurate, and representative – before it ever reaches the model training stage.
            </p>

            <h3 className="mt-4 font-semibold">Documentation and Transparency</h3>
            <p>
              Comprehensive dataset documentation is a linchpin of trustworthy AI, which is why it appears as a core category in our framework. It’s not enough to have a great dataset; others (regulators, clinicians, external researchers) need to know exactly what that dataset contains, how it was created, and what its limitations are<Cite i={25} />. Transparency through documentation enables reproducibility and helps identify hidden biases. For example, the influential work “Datasheets for Datasets” argues that every dataset should include a sort of fact-sheet covering its motivation, composition, collection process, recommended uses, and so on<Cite i={26} />. By answering these questions, dataset creators reflect on their choices and reveal assumptions or gaps that could otherwise go unnoticed<Cite i={27} />.
            </p>
                        <br></br>

            <p>
              Several initiatives have extended this idea to medical AI. The recent BEAMRAD framework (2024) developed a 45-item checklist for radiology and biomedical datasets, explicitly linking documentation fields to potential bias risks<Cite i={28} /><Cite i={29} />. For instance, documenting the “data source” (which centers or populations contributed data) is crucial because without it, users might not realize a dataset, say, came mostly from urban academic hospitals – a possible source of selection bias<Cite i={30} />. Similarly, recording the “inclusion/exclusion criteria” and patient demographics helps others gauge how well the dataset represents the intended patient population<Cite i={31} />. If a model is later applied to a different population, having that metadata allows an apples-to-apples performance analysis (e.g. does the model do worse for groups that were absent in the original data?)<Cite i={32} />.
            </p>
                        <br></br>

            <p>
              <Cite i={33} />  This highlights why thorough documentation isn’t just bureaucracy – it actively aids in surfacing and mitigating bias by forcing developers to be explicit about dataset details. In practice, a well-documented dataset should accompany any AI regulatory submission or publication. Notably, the EU draft AI Act and FDA’s AI action plan both endorse transparency in data provenance and characteristics as part of risk management<Cite i={35} />. Thus, a dataset risk framework places heavy emphasis on documentation quality, asking questions like: Is there a datasheet or equivalent? Does it describe who collected the data, under what consent, with what devices and settings, and any known biases or limitations? Such documentation transforms a dataset from a black box into a well-understood evidence base for AI development.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="country">
          <AccordionTrigger className="text-xl font-semibold">3. Country-Specific Modules</AccordionTrigger>
          <AccordionContent>
            <p>
              While core principles of privacy, consent, and quality apply everywhere, data risk management must also account for country-specific laws and norms. Different jurisdictions impose unique requirements on medical data – for instance, what’s considered “personal data,” what approvals are needed to use patient information, and how bias or discrimination is regulated. Our framework includes modules that adapt to legal contexts in the <strong>United States</strong>, <strong>European Union</strong>, and <strong>India</strong>, as three prominent examples. Below, we justify the inclusion of these modules and explain key jurisdiction-dependent risks, with hypothetical scenarios to illustrate how non-compliance or ignorance of local laws could derail a medical AI project.
            </p>
            <Tabs defaultValue="us" className="mt-4">
              <TabsList className="mb-4">
                <TabsTrigger value="us" className="mr-2">United&nbsp;States</TabsTrigger>
                <TabsTrigger value="eu" className="mr-2">European&nbsp;Union</TabsTrigger>
                <TabsTrigger value="india">India</TabsTrigger>
              </TabsList>
              <TabsContent value="us">
                <p>
                  <strong>United States:</strong> In the U.S., healthcare data is governed by a patchwork of federal and state laws, but a few pillars stand out. First, the <em>Health Insurance Portability and Accountability Act (HIPAA)</em> sets the baseline for health data privacy. Any dataset derived from patient records at a HIPAA-covered entity must be handled so that no Protected Health Information (PHI) is improperly disclosed. HIPAA’s de-identification standard (Safe Harbor) specifically requires removal of 18 types of identifiers, including patient names, full facial photos and “any comparable images,” and many other unique codes/biometrics<Cite i={36} />. A medical AI dataset that hasn’t been properly de-identified could trigger a serious HIPAA violation. For example, if a hospital releases a chest X-ray dataset and some images still have the patient’s name burned into the image pixels, that’s PHI leakage. There have been cases where medical imaging companies were fined under HIPAA for inadequate de-identification leading to exposure of patient data online.
                </p>
                            <br></br>

                <p>
                  Another U.S. requirement built into our framework is attention to <strong>research oversight and consent via IRBs (Institutional Review Boards)</strong>. If a dataset comes from a clinical study or was originally collected for research, U.S. federal regulations (the Common Rule) require IRB approval and informed consent for use of those samples/data, unless specific exemptions apply. This means that before using an old research dataset to develop a new AI algorithm, one must confirm that the original consent covers this secondary use, or else seek an IRB waiver or new consent. Neglecting this can not only violate ethics but also jeopardize publication or FDA approval down the line (the FDA expects data in submissions to come from ethically conducted studies when human subjects are involved).
                </p>
                            <br></br>

                <p>
                  The <strong>U.S. FDA (Food and Drug Administration)</strong> is another crucial piece. Medical AI software can be classified as a medical device (Software as a Medical Device, SaMD), which means FDA clearance or approval is needed to market it. The FDA in recent years has made it clear that they are scrutinizing dataset issues as part of the review. The agency’s 2021 AI/ML Action Plan and 2023 draft guidances emphasize things like ensuring training data is representative of the intended patient population and analyzing performance across subgroups to detect bias<Cite i={37} />. The FDA has even explicitly stated that submissions should include plans to mitigate algorithmic bias and ensure “equitable” performance. For example, if a company submits an AI radiology tool trained mostly on adults, the FDA may ask for evidence of how it performs on pediatric cases (or a justification if the intended use is only adults). If the dataset wasn’t diverse, the FDA might require additional testing or post-market surveillance to monitor for bias<Cite i={38} />. Thus, our U.S.-module of the risk framework highlights checks for dataset diversity and bias evaluation, aligning with FDA expectations.
                </p>
                            <br></br>

                <p>
                  Additionally, U.S. civil rights laws are increasingly relevant to AI datasets. Section 1557 of the Affordable Care Act (ACA) prohibits discrimination on the basis of race, sex, age, etc., in federally-funded health programs. In 2023, the HHS Office for Civil Rights issued a rule clarifying that this non-discrimination mandate extends to algorithms used in healthcare<Cite i={39} /><Cite i={40} />. In other words, if a hospital uses an AI model that disproportionately denies care to a protected group (say, an algorithm that recommends white patients for a specialty referral more often than black patients with the same data), that could be deemed discriminatory. In the context of datasets, this means organizations should assess whether their training data or model outputs introduce bias against protected classes. Our framework’s bias checks directly support compliance with ACA §1557 by prompting developers to evaluate and document demographic balance and model performance equity. A hypothetical scenario: a hospital is deploying an AI to prioritize ICU beds. If the training data was skewed in a way that the model undervalues patients from a certain ZIP code (which might correlate with minority status), this could raise red flags under ACA §1557. Proper dataset bias analysis and re-balancing can prevent such situations.
                </p>
                            <br></br>

                <p>
                  In summary, the U.S. module addresses: HIPAA (privacy and de-identification), IRB/Human Subjects regulations (consent and ethical use), FDA requirements (data quality, bias and subgroup analysis), and anti-discrimination laws. By following this module, an AI developer could confidently answer to a reviewer or regulator how they have handled U.S.-specific legal risks. For example, they would maintain documentation that all PHI was stripped (HIPAA), that data use was covered by consent or an IRB determination, and that they proactively evaluated the model for bias in line with FDA and civil rights guidance. Each of these steps is justified by real regulatory expectations and legal obligations in the United States.
                </p>
              </TabsContent>
              <TabsContent value="eu">
                <p>
                  <strong>European Union:</strong> The EU has some of the world’s strictest data protection and medical device regulations, which directly inform our framework’s risk checks. At the heart of EU data law is the General Data Protection Regulation (GDPR). Health data is classified as “special category” personal data under GDPR Article 9, which means its processing is generally prohibited unless specific conditions are met (such as explicit patient consent, or use for vital public health interests, etc.). Any medical AI dataset involving EU patients must therefore have a lawful basis under GDPR. In practice, the simplest route is often obtaining the patient’s explicit consent for their data to be used in AI development<Cite i={41} />. Our framework’s emphasis on documented patient consent and data authorization ties in here – one should verify that for all EU-sourced data, consent was obtained in a GDPR-compliant way (freely given, specific, informed, and unambiguous). Otherwise, another legal basis (like a research ethics approval or anonymization to GDPR standards) must be in place. Failure to comply with GDPR can be extremely costly – fines can reach up to €20 million or 4% of a company’s global annual turnover<Cite i={42} />. This is not just a theoretical risk: regulators in Europe have issued multi-million euro fines to companies (including those in health tech) for misuse or insecure handling of personal data.
                </p>
                            <br></br>

                <p>
                  Even if data is “anonymized,” EU law has a higher bar for what counts as truly anonymous (data that can never be re-linked to an individual, which is quite stringent). If there’s any reasonable way to re-identify the data (for example, high-resolution imaging data that could be matched to identifiable scans), GDPR likely still applies. Hence, our risk framework includes steps like verifying that robust de-identification (or pseudonymization) techniques have been applied for EU data, and that any data transfer out of the EU meets cross-border transfer rules. The latter is important because GDPR restricts exporting personal data to countries that lack equivalent protections. For instance, a European hospital sharing images with a U.S. AI startup needs to use mechanisms like Standard Contractual Clauses to be lawful. A framework assessor would check: are there EU patient data in this dataset, and if so, do we have proper consent and data transfer agreements in place?
                </p>
                            <br></br>

                <p>
                  The EU also has the <strong>Medical Device Regulation (MDR, 2017/745)</strong>, which governs software used for medical purposes. Under the MDR, many AI algorithms (for example, an AI that assists in diagnosing tumors from images) are classified as medical devices. The MDR mandates a rigorous conformity assessment, including clinical evaluation of performance and safety. One requirement is that the evidence used to support an AI device (which includes the training and validation data) must demonstrate scientific validity for the intended use. In simpler terms, if you claim your AI will be used on European patients, you must show data proving it works for that population and doesn’t introduce unacceptable risks. If your dataset was, say, mostly from one ethnic group or one type of scanner, European notified bodies (which audit MDR compliance) might raise concerns about generalizability. They might expect to see that the model was tested on data from different centers, representing the diversity of the EU patient population. While the MDR doesn’t explicitly list “bias” in the text, it does emphasize risk management and performance for all intended users. Our framework’s bias and representativeness checks support these MDR obligations by prompting developers to consider demographic and clinical diversity as part of their validation.
                </p>
                            <br></br>

                <p>
                  We also include forward-looking considerations for the upcoming <strong>EU AI Act</strong> (which is likely to be enacted soon, potentially by 2024/2025). The AI Act will classify medical AI systems as “high-risk,” imposing requirements like robust risk management, data governance, transparency to users, and oversight mechanisms. Notably, draft versions of the AI Act require that training datasets for high-risk AI be assessed for relevant biases and appropriate for the purpose (avoiding bias that leads to discrimination, for example). It also will likely require documentation of the dataset characteristics and data provenance. Thus, our EU module’s elements – such as bias audits, documentation, and privacy compliance – neatly map to what the AI Act is anticipated to enforce. For example, if an AI model for detecting skin cancer goes to market in Europe, under the AI Act the provider might have to demonstrate they checked that the training data covers different skin types to avoid racial bias. By already having that in our framework, we’re ahead of the curve.
                </p>
                            <br></br>

                <p>
                  In summary, the EU-specific module is justified by the GDPR’s strict privacy and consent regime (necessitating checks on lawful basis and strong de-identification), the MDR’s safety and performance requirements (necessitating comprehensive validation data and bias mitigation), and the emerging AI Act’s focus on data quality and transparency. A concrete legal scenario: Imagine a company in the EU fails to obtain proper consent for using patient scans in AI development; under GDPR they could face enforcement (indeed, using personal health data without proper consent or exemption is illegal). Or consider if an AI tool made it to market and a patient alleged it doesn’t work for minority groups – regulators could investigate whether the company met its MDR obligations to ensure equitable performance. Our framework is designed to preempt such issues by embedding compliance into the dataset stage itself.
                </p>
              </TabsContent>
              <TabsContent value="india">
                <p>
                  <strong>India:</strong> The regulatory landscape in India has some unique features that we capture in our framework. First, India recently enacted the <em>Digital Personal Data Protection (DPDP) Act, 2023</em>, which overhauled its data privacy laws. Health data in India is considered sensitive personal data, and the DPDP Act requires organizations to obtain explicit consent from individuals for processing such data, with limited exceptions. The Act grants individuals (called Data Principals) rights over their data – including rights to access, correct, and erase information<Cite i={43} /><Cite i={44} />. A dataset risk framework for India must therefore ensure that any patient data used to train AI either has proper consent or falls under a permitted purpose. For example, if a hospital in India is contributing CT scans to a multi-center AI study, it should have consent from those patients or a valid legal basis (like government-approved research project) as per DPDP. The framework prompts verification of this, because using data beyond the consent given could violate Indian law. The DPDP Act also emphasizes data security and accountability – organizations must implement safeguards and can face hefty penalties for data breaches or misuse (fines up to ₹250 crore for serious violations)<Cite i={45} />. Thus, our framework’s focus on security controls and audit trails aligns with ensuring DPDP compliance. An illustrative scenario: an Indian tech startup using a public dataset of chest X-rays should double-check that the dataset was collected in line with Indian consent norms; if it turns out those images were taken from patients without proper consent, the startup could be at legal risk under DPDP when it processes that data.
                </p>
                            <br></br>

                <p>
                  India also has very specific laws addressing misuse of medical data in certain contexts. A prime example is the <strong>Pre-Conception and Pre-Natal Diagnostic Techniques (PC-PNDT) Act of 1994</strong> and its amendments. This law was enacted to curb the practice of sex-selective abortion (female foeticide) in India. It strictly prohibits using ultrasound scans or other prenatal diagnostic techniques for determining the sex of a fetus, and bans the communication of fetal sex to parents<Cite i={46} />. The inclusion of this in our framework is important for any AI dealing with obstetric ultrasound images. For instance, imagine an AI model that analyzes ultrasound videos to detect anomalies. Even if its primary intent is medical (say, detecting congenital heart defects), there’s a potential risk that the model could also infer the fetus’s sex as a byproduct. If a dataset includes labeled fetal sex or if the model could allow users to derive sex, that would violate the PNDT Act. Our risk checklist would flag this: are we working with prenatal data? If yes, ensure no sex determination is taking place and no labels or outputs facilitate that. The PNDT Act is taken very seriously in India – violations (like clinics illegally revealing fetal gender) have led to clinic closures and legal prosecutions. So a framework addressing India must account for this societal risk. We justify it not only legally but morally: the risk of AI inadvertently contributing to gender-biased harm (even indirectly) must be mitigated. By, for example, excluding fetal sex as a feature, or ensuring the model cannot predict it, developers stay on the right side of the law and ethics.
                </p>
                            <br></br>

                <p>
                  Another India-specific consideration is the regulation of AI as medical devices through the Central Drugs Standard Control Organisation (CDSCO). India’s CDSCO has been updating its guidance to encompass software and AI. It released guidelines in 2021 classifying SaMD and aligning with International Medical Device Regulators Forum (IMDRF) definitions<Cite i={47} />. What this means is that an AI diagnostic tool in India may require approval just like a drug or traditional device. The approval process typically demands data on the algorithm’s performance in an Indian population and evidence that it’s safe and effective. Therefore, our framework encourages checking for compliance with CDSCO expectations: e.g., do we have clinical data from Indian patients, or if not, is there a justification? Are we prepared to meet requirements for bias evaluation and risk mitigation that regulators may ask for? For example, if an AI for detecting tuberculosis on chest X-rays was trained mostly on images from abroad, a developer should be aware that CDSCO might require local validation data due to differences in demographics or disease patterns (say, higher incidence of TB in certain Indian subpopulations could affect prevalence in the dataset).
                </p>
                            <br></br>

                <p>
                  Finally, India’s legal environment also includes provisions like the <strong>Information Technology Act</strong> and sectoral guidelines that intersect with data use. While those are broader, our framework’s inclusion of modules for India ensures we capture the main healthcare-specific risks: DPDP Act compliance (privacy/consent), PNDT Act compliance (specific ethical guardrails on prenatal data), and CDSCO regulatory compliance (for AI intended for clinical use). Let’s consider a concrete hypothetical: A company develops a skin lesion AI using a global dataset and wants to deploy it in India. Our framework would remind them to check DPDP Act – if they are collecting any local data, get proper consent and secure it. It would flag to ensure no unintended outputs violate laws (not much risk of PNDT here, but perhaps ensure fairness across skin tones to avoid any indirect bias which, while not legally mandated, aligns with constitutional anti-discrimination values). And it would point out that if this is a diagnostic service, CDSCO approval may be required, for which they’ll need to show the dataset and performance cover Indian patients. By addressing these issues early (dataset assembly phase), the company can avoid roadblocks like regulators rejecting their application or, worse, public backlash after deployment due to overlooked ethical issues.
                </p>
              </TabsContent>
            </Tabs>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="modality">
          <AccordionTrigger className="text-xl font-semibold">4. Modality-Specific Risk Considerations</AccordionTrigger>
          <AccordionContent>
            <p>
              Not all medical data is the same – an AI trained on radiology images faces different dataset risks than one trained on pathology slides or dermatology photos. Our framework therefore includes modality-specific checkpoints. These ensure that for each type of medical imaging or data modality, we consider the unique ways that privacy, bias, or other risks might manifest. Here we justify a few examples (radiology, pathology, ophthalmology, endoscopy/surgery, dermatology), showing why one-size-fits-all risk management is not enough and how tailoring to modality makes the framework more robust.
            </p>
            <h3 className="mt-4 font-semibold">Radiology</h3>
            <p>
              Radiology images (like X-rays, CTs, MRIs, ultrasound) are often considered less identifiable than photographs – after all, a chest X-ray is just a picture of your insides. However, a major risk in radiology data is that certain scans can indeed reveal identity. A prime example is head MRI or CT scans: these can be rendered into a 3D model of a person’s face. Researchers have shown that such 3D reconstructions from MRI can be matched to patients’ actual facial photos via facial recognition, compromising privacy<Cite i={48} />. Even “defaced” MRI scans (where some facial data is removed) have been found vulnerable to re-identification with advanced algorithms. Therefore, our framework flags any datasets containing head or facial anatomy – special precautions (like using robust de-identification tools or checking if faces can be reconstructed) are warranted. Beyond facial ID, radiology images can contain embedded metadata (DICOM tags) with patient names or IDs if not stripped. Cases have occurred where public DICOM files still had the patient’s name in the header. Thus, a modality-specific check for radiology is to ensure all DICOM metadata has been anonymized and that no visible patient identifiers (like a name on an X-ray film) are present.
            </p>
                        <br></br>

            <p>
              Another modality-specific issue in radiology is <strong>incidental findings and bias</strong>. For example, an AI model trained on chest X-rays might inadvertently learn shortcuts – like associating the presence of an arm bone (humerus) in the corner of an image with patient sex or age (if more males were imaged with a certain positioning). Indeed, there was a surprising finding that AI could predict a patient’s self-reported race from just their X-ray images, even though radiologists cannot do this<Cite i={49} />. The exact mechanism remains unclear, but it highlights that radiology images contain subtle signals of demographics. A risk is that a model might leverage those signals inappropriately (for example, a lung nodule detector might perform differently based on the patient’s race, not because race affects nodules, but because of some confounding image features). Our framework thus encourages tests for spurious correlations in radiology models – e.g., does performance drop when certain irrelevant image features are masked out? Are there latent variables being picked up? It also encourages diversity in radiology training data (different hospitals, scanner types, patient backgrounds) to avoid a model that is overfit to one context.
            </p>
                        <br></br>

            <p>
              Radiology also intersects with legal risk in specific ways. In the U.S., if your radiology AI uses or produces images that include identifiable facial features (like 3D MRIs), those are PHI under HIPAA<Cite i={50} />, necessitating either patient authorization or proper de-identification. In India, if you’re dealing with pregnancy ultrasounds, you must avoid anything that could be interpreted as prenatal sex determination (per the PNDT Act). We include modality-tailored prompts for such regulations. For example, an ultrasound AI dataset in our framework would have an item: “If obstetric ultrasounds from India are included, confirm that no labels or outputs relate to fetal sex, and that use complies with PNDT.” This level of detail is only possible by considering modality (since fetal sex isn’t an issue for, say, MRI of the knee).
            </p>
            <h3 className="mt-4 font-semibold">Pathology</h3>
            <p>
              Digital pathology involves whole-slide images (WSI) of tissue specimens, which are extremely high-resolution images often obtained from biopsy slides. These have some unique risk factors. One is that WSIs may have identifying information if slides were scanned with labels. For instance, a pathology slide image might inadvertently capture a patient’s name or a case number on the slide label if the lab technician didn’t cover it. Our framework’s pathology module reminds dataset curators to inspect the borders of images for any such labels or handwriting and to blur them out. This is a small detail, but in a famous incident, a publicly released dermatology image dataset had some photos where patient info was visible on ruler markings or slide margins, leading to a recall of the dataset.
            </p>
                        <br></br>

            <p>
              Another concern in pathology data is the potential presence of rare or sensitive findings that could indirectly identify a patient. For example, a pathology image might show a unique tattoo ink particle in a skin specimen or a rare genetic mutation test result overlaid – things that are unlikely, but if present could make a case identifiable to those who know the patient. Generally, pathology images by themselves are hard to trace to a person (unlike facial images), but caution is still warranted in sharing them.
            </p>
                        <br></br>

            <p>
              Bias in pathology datasets can also be modality-specific. If all tissue slides in a training set come from one lab’s scanning equipment, the AI might get “covariate-shift” shock when encountering images from a different scanner or stain protocol. Our framework suggests including a variety of sources or doing stain normalization. It also encourages checking the dataset for spectrum of disease severity. Pathology AI often deals with class-imbalanced data (most slides might be normal, a few contain cancer). If not handled, a model might simply learn to output “normal” for everything. We justify modality focus here because the solutions (like hard negative mining, tiling strategies) are particular to WSI data and wouldn’t be covered in a generic checklist.
            </p>
                        <br></br>

            <p>
              A real-world scenario underlining governance: a prominent case in 2018 involved a New York hospital sharing 25 million pathology slide images with an AI startup (for developing pathology algorithms) – it drew scrutiny because hospital board members had stakes in the company<Cite i={51} />. While that was more a conflict-of-interest issue, it teaches that datasets containing human tissue data should be handled transparently and in line with research ethics. Our framework’s pathology module thus reminds to verify material transfer agreements and IRB approvals for sharing human tissue images. This is especially relevant if slides came from patients in clinical trials or specific studies. In summary, pathology-specific checks (removing identifiers on slide images, ensuring diverse staining/scanner representation, controlling class imbalance, and compliance with tissue use ethics) strengthen the overall risk mitigation for AI on histopathology data.
            </p>
            <h3 className="mt-4 font-semibold">Ophthalmology (Retinal Imaging)</h3>
            <p>
              Ophthalmology AI, particularly those analyzing retinal fundus photographs or OCT scans, has seen remarkable breakthroughs – and some unexpected risks. A striking example was when researchers (from Google and elsewhere) discovered that AI can predict a patient’s biological sex from a retinal fundus image with over 85% accuracy<Cite i={52} />. This was startling because ophthalmologists themselves cannot determine sex from an eye exam. Moreover, retinal images have been used to predict age, blood pressure, smoking status, and even cardiovascular risk with surprising accuracy<Cite i={53} /><Cite i={54} />. On one hand, these are exciting medical insights (often termed “oculomics”). On the other hand, they raise privacy and misuse concerns: an ostensibly anonymous eye scan actually encodes personal attributes like gender and health indicators that a malicious actor or an insurer might exploit. For instance, an insurance company could, in theory, use a retinal image to infer if someone is a smoker or has high cardiovascular risk, and then adjust premiums or coverage – all without the patient explicitly providing that information.
            </p>
                        <br></br>

            <p>
              Our framework’s modality section for ophthalmology flags this kind of risk. If an AI is trained on retinal images, developers should be aware that the model might inadvertently learn to recognize features like age or sex, which could bias its clinical outputs or be a vector for privacy leakage. We encourage testing what “else” the model might be learning. For example, if building a diabetic retinopathy detector, one might also test the model on a task like predicting patient age from the embeddings – to see if demographic signals are entangled. If they are, one might consider techniques to decorrelate those factors to ensure fairness. Also, from a consent perspective, patients might not expect that donating an eye scan could reveal their smoking history. Full transparency in patient information sheets is advised (so patients know AI might glean incidental personal data from images).
            </p>
                        <br></br>

            <p>
              Another ophthalmology-specific consideration is data diversity across devices and populations. Fundus cameras vary, and diseases present differently across ethnic groups (e.g., higher myopia rates in some Asian populations could affect algorithm performance in detecting certain retinal conditions). Thus, dataset risk management here involves ensuring a broad representation of retinal images – multiple clinics, ethnogeographic diversity, different camera types. The framework explicitly reminds to check if, say, all images came from a single make of fundus camera; if yes, note that as a limitation or acquire supplementary data. The rationale is drawn from cases where AI systems had degraded performance on images from devices not seen in training.
            </p>
                        <br></br>

            <p>
              In summary, ophthalmology imaging taught us that even “silent” data (like an eye photo) can carry sensitive info and hidden biases. A modality-tailored risk approach accounts for these lessons, guiding AI developers to safeguard against privacy leakage (e.g., do not inadvertently expose sensitive predictions) and to build robust, generalizable ophthalmic AI.
            </p>
            <h3 className="mt-4 font-semibold">Endoscopy & Surgical Video</h3>
            <p>
              AI in endoscopy (e.g., colonoscopy polyp detection) and surgical videos (e.g., tool identification or skill assessment systems) introduces another set of dataset risks. These modalities involve video data from inside the body or the operating room. One immediate concern is privacy: while an endoscopy video typically shows internal organs, there are moments that could reveal a patient’s outward anatomy or even face (for instance, an upper endoscopy might briefly capture the patient’s open mouth/face). Surgical videos might accidentally show the patient’s identifiable features or the faces of the surgical staff. Our framework flags these possibilities, ensuring that any such frames are blurred or removed if datasets are being created for AI. Even though it sounds rare, consider laparoscopic surgery – the initial scene might show the exterior incision area with skin (and possibly tattoos or scars unique to the patient). Those are identifying. Similarly, OR videos often have a time display that might include patient initials or the medical record number on the overlay. We advise checking and redacting any text overlays in surgical videos that could contain identifiers.
            </p>
                        <br></br>

            <p>
              Another issue in surgery videos is consent and ethics. In many jurisdictions, patients must consent to recordings of their surgery for anything other than internal hospital use. A dataset of surgical videos assembled for AI research should have documentation that patients (and surgeons) consented to be recorded and for those recordings to be used in AI development. Our framework’s legal module would tie in here (e.g., in the U.S., this would be an IRB matter; in the EU, GDPR consent, etc.). But we highlight it under modality because it’s particularly salient for video recordings compared to, say, lab test datasets.
            </p>
                        <br></br>

            <p>
              Bias in surgical data can relate to variations in technique and equipment. An AI trained on videos from one surgical team might struggle when faced with another team’s methods. For instance, if all training videos for a laparoscopic AI come from expert surgeons, the AI might have trouble interpreting footage from trainees (or vice versa). Thus, a risk is that the dataset isn’t representative of the range of skill or styles in real-world use. Our framework encourages curation of a balanced set – including different surgeons, different patient anatomies, perhaps different hospitals with varying equipment – to avoid overly narrow AI. It also suggests capturing metadata like the type of endoscope or camera used, because an algorithm might not generalize from, say, a 1080p high-definition camera to an older standard-definition one.
            </p>
                        <br></br>

            <p>
              We also mention a unique societal risk in surgical AI: the potential for misuse of videos. Surgical and endoscopic videos, if leaked, could be quite sensitive (they might show intimate body parts or reveal a person’s health status). There’s also a “dual use” concern – could surgery recordings be used to train AI for non-medical surveillance or other purposes? While beyond the immediate scope, our framework’s inclusion of data governance policies (access control, data sharing agreements) helps prevent inappropriate secondary uses of such data.
            </p>
                        <br></br>

            <p>
              In essence, for endoscopy and surgical modalities, the framework provides checks on privacy (remove any external/personal identifiers in frames), consent (ensure recordings are authorized for use), and technical generalizability (account for different devices and user variability). This is justified by real incidents like: one hospital noticed that an AI trained on its colonoscopy videos failed when used on videos from a different clinic – upon investigation, differences in scope camera color profiles were to blame. By proactively addressing these, we aim to prevent modality-specific pitfalls.
            </p>
            <h3 className="mt-4 font-semibold">Dermatology</h3>
            <p>
              Dermatology AI often relies on clinical photographs of skin lesions. These images bring perhaps the most obvious privacy risk: they are photographs and often include surrounding skin context. If a lesion is on a patient’s face, the photo might show their face – which is directly identifiable. Even lesions on other body parts can have unique identifiers (tattoos, birthmarks, or even just the background environment in the photo). Under privacy rules (like HIPAA), a full-face photo or any image where the patient is recognizable is PHI<Cite i={55} />, so such images must be treated carefully. Our framework’s dermatology module mandates strict de-identification: either images should be cropped to only the lesion (if that’s feasible and clinically valid), or patients should consent knowing their identifiable photos are used, and access to the dataset should be restricted. In public dermatology datasets, it’s common to blur the patient’s eyes or cover them with a black box in images of faces – that’s a simple measure we’d ensure is on the checklist.
            </p>
                        <br></br>

            <p>
              Bias and representation are major concerns in dermatology, as we touched on earlier. Many publicly available derm datasets (like ISIC for melanoma) have disproportionately light-skinned patients, which can lead to AI that under-detects conditions in darker skin. This is not hypothetical – studies have noted that both AI and dermatologists have lower diagnostic accuracy on dark skin, likely due to lack of training examples<Cite i={56} />. Thus, the modality-specific risk check here is to assess skin tone diversity of the dataset. We justify including a specific item for this (rather than a generic “check bias”) because it’s such a well-documented issue in dermatology. The framework might suggest using tools or metrics to quantify skin type distribution (like the Fitzpatrick scale) in the dataset. If the dataset skews heavily towards Fitzpatrick I–III (lighter skin), the framework would prompt the team either to gather more images of IV–VI or at least acknowledge this limitation and plan to mitigate it (maybe by adjusting contrast or using synthetic data augmentation for darker tones, etc.).
            </p>
                        <br></br>

            <p>
              Another dermatology-specific risk involves the annotations: many dermatology images are annotated with disease labels that can carry implicit biases. For instance, one dataset might label images as “benign” vs “malignant” based on a particular healthcare setting’s diagnosis, which could bias an AI if those diagnoses were themselves biased or correlated with demographics. Also, some conditions are culturally sensitive – e.g., images of certain sexually transmitted infections might be stigmatizing if leaked. So beyond just model performance, there’s a sensitivity aspect: if a dataset includes images labeled with something like “HIV-associated rash,” that’s effectively health information about the patient which could be sensitive. Our framework encourages careful handling of such labels and perhaps refraining from including certain sensitive attributes unless necessary. It’s about anticipating how misuse or leaks could cause harm (imagine an identifiable photo labeled with “Syphilis” circulating – that’s both a privacy breach and could harm the patient’s reputation).
            </p>
                        <br></br>

            <p>
              Finally, we consider legal concerns: in some countries, there are restrictions on sharing images of certain conditions (for instance, some jurisdictions may have rules about handling images related to reproductive health or nudity). Dermatology photos sometimes involve sensitive areas of the body, raising questions of modesty and consent. All images in this domain should have clear patient consent for photography and use in research. Our framework would check that for each dataset image there’s a record of consent (many academic dermatology datasets note that images were obtained with patient consent for educational use – we extend that to AI use).
            </p>
                        <br></br>

            <p>
              Overall, the modality-specific considerations for dermatology are justified by past issues (e.g., AI failing on dark skin, privacy breaches with identifiable photos) and ensure that what might seem like a straightforward dataset (just pictures of rashes) is examined with a nuanced lens for risk. By tailoring the checklist to each modality as above, we make sure not to miss subtle but important points that a generic approach might overlook.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="beyond">
          <AccordionTrigger className="text-xl font-semibold">5. Beyond the Obvious: Additional Risk Domains</AccordionTrigger>
          <AccordionContent>
            <p>
              The final part of our framework goes “beyond the obvious” – capturing risk domains that might not be immediately apparent, especially to technical teams focused narrowly on model metrics. These include societal and ethical risks, potential malicious uses of data or models, and broader geopolitical or dual-use concerns. By justifying these items, we ensure that the checklist doesn’t shy away from fuzzy but important areas that could severely impact trust in medical AI. Here are several such domains and why they earn a place in our framework.
            </p>
                        <br></br>

            <p>
              <strong>Societal Harm – Example: Female Foeticide.</strong> We touched on this under India’s PNDT Act, but it bears emphasis as a general risk domain: AI systems can inadvertently abet harmful social practices if we’re not careful. In cultures or regions with strong biases (e.g. a preference for male children), an AI that reveals or predicts such information can be misused. The PNDT Act in India was a reaction to rampant sex-selective abortion that skewed the gender ratio<Cite i={57} /><Cite i={58} />. Imagine a scenario where an AI, perhaps designed to analyze ultrasound images for birth defects, also ends up giving clues about fetal sex (maybe via subtle annotations or simply by skilled users noticing patterns). If that got out, it could be used to facilitate sex selection, contributing to gender-based harm. Our framework explicitly includes checks to prevent this: e.g., if working with prenatal data, ensure the model and dataset are purged of sex-related information. Societal harms can go beyond gender issues – another example is AI in imaging that could potentially predict race (as we discussed). In a society with racial discrimination, could that be misused by actors to provide different levels of care? It’s speculative, but we include the thought experiment because being forewarned allows mitigations. Essentially, we ask, “Could this dataset/AI be weaponized to reinforce a known social bias or illegal practice?” If yes, we then require steps to counter that risk (technical or policy measures).
            </p>
                        <br></br>

            <p>
              <strong>Re-identification via External Linkage.</strong> Even if a dataset is scrubbed of obvious identifiers, we must consider the risk that it could be linked with other data sources to re-identify patients. A famous example in data privacy is how researchers re-identified individuals in an anonymized genomic database by cross-referencing it with public genealogy data. In the medical imaging realm, one might link “de-identified” images with, say, online selfies (as was done in the MRI face study) or with healthcare provider databases (if some metadata leaks). Studies have shown that using machine learning and auxiliary information, very high re-identification rates are possible – one study managed to re-identify 85% of individuals out of a large pool<Cite i={59} />. Our framework treats re-ID risk as more than a theoretical worry. We encourage dataset owners to perform or review re-identification risk assessments (which might involve an expert determination as allowed by HIPAA, or running a face recognition test on a sample of images). If the risk is non-trivial, measures like blurring facial features, reducing resolution, or aggregating data may be warranted. We also stress compliance with laws that prohibit re-identification attempts. For instance, Singapore and Australia have laws making it illegal to knowingly re-identify anonymized data. Canada too, while lacking federal privacy for de-identified data, would frown upon deliberate misuse<Cite i={60} />. By including this in the framework, we basically remind stakeholders that anonymity is not a binary – it’s a continuum of risk that needs ongoing vigilance.
            </p>
                        <br></br>

            <p>
              <strong>Malicious Use and Dual-Use Concerns.</strong> Any powerful technology can be misused. We consider scenarios like: Could someone use a publicly released medical image dataset to create fake but realistic medical images that sow confusion (deepfakes for health)? Or could a diagnostic AI be repurposed as a triage tool that maliciously withholds care from certain groups? One concrete malicious use is ransomware actors exploiting stolen medical images. Unfortunately, large datasets of images have been left exposed (as mentioned earlier) and bad actors could encrypt them or threaten to publish patients’ images unless paid<Cite i={61} />. While data breaches are an IT security issue, our framework addresses the aftermath risk: ensuring that datasets do not contain information that, if leaked, could be easily abused. For example, if a dataset has not just images but also a spreadsheet linking those images to patient names (for ground truth), that is extremely sensitive and should never be stored in the same place without strong protection. We include guidance on partitioning identifiers from images and using coded IDs, so that even if images leak, linking them to identities is harder.
            </p>
                        <br></br>

            <p>
              Dual-use concerns refer to technology developed for good being used for harm. In a geopolitical context, imagine an AI intended to screen chest X-rays for TB being repurposed by a state actor to screen migrants’ X-rays for biomarkers to profile them (there have been speculative discussions about predicting ethnicity or other traits). Another angle is data localization laws: some countries consider health data a national asset (China, for instance, restricts sending health data abroad). If a multinational project aggregates imaging data from around the world on a cloud, there might be geopolitical sensitivities – e.g., a country might object to foreign companies holding its population’s medical images, citing potential intelligence or bioweapon concerns. Our framework includes a “geopolitical risk” query: are there cross-border data transfers, and do they comply with local laws? (E.g., for China or Russia one would tread very carefully, for EU use GDPR mechanisms, etc.) We also ask teams to consider if publishing a dataset could inadvertently reveal something like the health profile of a specific ethnic group or region that could be stigmatized or targeted. Admittedly, these are edge cases, but the COVID-19 pandemic gave a taste of this: data about infection rates was politicized; one could imagine AI models being used to infer things like prevalence of diseases in military vs civilian populations, etc.
            </p>
                        <br></br>

            <p>
              Finally, <strong>insurance and employment discrimination</strong> via AI predictions is a salient risk. As noted, retinal AI can predict things like smoking status or blood pressure that an insurer would love to know. If an AI model’s outputs (even if the model is intended for clinical use) could be available to non-clinical parties, there’s a risk of misuse. In the U.S., laws like GINA (Genetic Information Nondiscrimination Act) prevent genetic data misuse, but there’s no specific law yet for “AI inferred data” like predicting someone’s Alzheimer’s risk from a brain scan. However, ACA §1557 and general civil rights laws could be interpreted to cover some of this if it leads to healthcare discrimination<Cite i={62} />. Our framework hence encourages measures like access control – ensure that the outputs of AI (especially sensitive inferences) are only used for the intended purpose and by authorized personnel. We also incorporate the notion of transparency: if an AI is making predictions about sensitive traits (even implicitly), that should be disclosed to patients and they should have the right to opt out.
            </p>
                        <br></br>

            <p>
              By including these “beyond the obvious” domains, we aim to make the framework a 360-degree safety net. It’s informed by historical examples (data leaks, re-ID studies, etc.) and ethical foresight. The ultimate justification is that trustworthy AI in healthcare is not just about model accuracy – it’s about anticipating how technology interacts with society at large. The checklist items, ranging from checking for potential PNDT violations to ensuring no unaddressed biases remain, all serve to protect against less tangible but extremely important risks. For an AI project team, these might initially seem like overkill – until one of these issues emerges and derails the entire endeavor. By then, it’s often too late (public trust is lost or legal action commences). So we proactively include and justify them, grounding each in either a known case or a regulatory principle, thereby rounding out our risk reporting framework in a truly comprehensive manner.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
