export interface Article {
  number: number | string;
  title: string;
  content: string;
  part: string;
  category: 'Fundamental Rights' | 'Fundamental Duties' | 'Directive Principles' | 'Other';
  summary: string;
  relatedArticles?: Array<number | string>;
}

export const constitutionArticles: Article[] = [
  // Fundamental Rights (Articles 12-35)
  {
    number: 12,
    title: "Definition of State",
    content: "In this part, unless the context otherwise requires, 'the State' includes the Government and Parliament of India and the Government and the Legislature of each of the States and all local or other authorities within the territory of India or under the control of the Government of India.",
    part: "Part III",
    category: "Fundamental Rights",
    summary: "Defines what constitutes 'State' for the purpose of Fundamental Rights",
    relatedArticles: [13, 14, 15]
  },
  {
    number: 13,
    title: "Laws inconsistent with or in derogation of the fundamental rights",
    content: "(1) All laws in force in the territory of India immediately before the commencement of this Constitution, in so far as they are inconsistent with the provisions of this Part, shall, to the extent of such inconsistency, be void. (2) The State shall not make any law which takes away or abridges the rights conferred by this Part and any law made in contravention of this clause shall, to the extent of the contravention, be void.",
    part: "Part III",
    category: "Fundamental Rights",
    summary: "Declares that any law inconsistent with Fundamental Rights is void",
    relatedArticles: [12, 14]
  },
  {
    number: 14,
    title: "Equality Before Law",
    content: "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.",
    part: "Part III",
    category: "Fundamental Rights",
    summary: "Guarantees equality before law and equal protection of laws to all persons",
    relatedArticles: [15, 16, 17]
  },
  {
    number: 15,
    title: "Prohibition of Discrimination",
    content: "(1) The State shall not discriminate against any citizen on grounds only of religion, race, caste, sex, place of birth or any of them. (2) No citizen shall, on grounds only of religion, race, caste, sex, place of birth or any of them, be subject to any disability, liability, restriction or condition with regard to access to shops, public restaurants, hotels and places of public entertainment; or the use of wells, tanks, bathing ghats, roads and places of public resort maintained wholly or partly out of State funds or dedicated to the use of the general public.",
    part: "Part III",
    category: "Fundamental Rights",
    summary: "Prohibits discrimination on grounds of religion, race, caste, sex, or place of birth",
    relatedArticles: [14, 16, 17]
  },
  {
    number: 16,
    title: "Equality of Opportunity in Public Employment",
    content: "(1) There shall be equality of opportunity for all citizens in matters relating to employment or appointment to any office under the State. (2) No citizen shall, on grounds only of religion, race, caste, sex, descent, place of birth, residence or any of them, be ineligible for, or discriminated against in respect of, any employment or office under the State.",
    part: "Part III",
    category: "Fundamental Rights",
    summary: "Ensures equal opportunity in public employment",
    relatedArticles: [14, 15]
  },
  {
    number: 17,
    title: "Abolition of Untouchability",
    content: "'Untouchability' is abolished and its practice in any form is forbidden. The enforcement of any disability arising out of 'Untouchability' shall be an offence punishable in accordance with law.",
    part: "Part III",
    category: "Fundamental Rights",
    summary: "Abolishes untouchability and forbids its practice in any form",
    relatedArticles: [14, 15]
  },
  {
    number: 18,
    title: "Abolition of Titles",
    content: "(1) No title, not being a military or academic distinction, shall be conferred by the State. (2) No citizen of India shall accept any title from any foreign State. (3) No person who is not a citizen of India shall, while he holds any office of profit or trust under the State, accept without the consent of the President any title from any foreign State.",
    part: "Part III",
    category: "Fundamental Rights",
    summary: "Abolishes hereditary titles and regulates foreign titles",
    relatedArticles: [14]
  },
  {
    number: 19,
    title: "Protection of Certain Rights",
    content: "(1) All citizens shall have the right— (a) to freedom of speech and expression; (b) to assemble peaceably and without arms; (c) to form associations or unions; (d) to move freely throughout the territory of India; (e) to reside and settle in any part of the territory of India; (f) to acquire, hold and dispose of property (omitted); (g) to practise any profession, or to carry on any occupation, trade or business.",
    part: "Part III",
    category: "Fundamental Rights",
    summary: "Guarantees six fundamental freedoms to all citizens",
    relatedArticles: [20, 21, 22]
  },
  {
    number: 20,
    title: "Protection in Respect of Conviction for Offences",
    content: "(1) No person shall be convicted of any offence except for violation of a law in force at the time of the commission of the act charged as an offence, nor be subjected to a penalty greater than that which might have been inflicted under the law in force at the time of the commission of the offence. (2) No person shall be prosecuted and punished for the same offence more than once. (3) No person accused of any offence shall be compelled to be a witness against himself.",
    part: "Part III",
    category: "Fundamental Rights",
    summary: "Provides protection against ex-post-facto laws, double jeopardy, and self-incrimination",
    relatedArticles: [19, 21, 22]
  },
  {
    number: 21,
    title: "Protection of Life and Personal Liberty",
    content: "No person shall be deprived of his life or personal liberty except according to procedure established by law.",
    part: "Part III",
    category: "Fundamental Rights",
    summary: "Protects right to life and personal liberty - the heart of Fundamental Rights",
    relatedArticles: [19, 20, 22, "300A"]
  },
  {
    number: "21A",
    title: "Right to Education",
    content: "The State shall provide free and compulsory education to all children of the age of six to fourteen years in such manner as the State may, by law, determine.",
    part: "Part III",
    category: "Fundamental Rights",
    summary: "Guarantees free and compulsory education for children aged 6-14 years",
    relatedArticles: [21, 45]
  },
  {
    number: 22,
    title: "Protection Against Arrest and Detention",
    content: "(1) No person who is arrested shall be detained in custody without being informed, as soon as may be, of the grounds for such arrest nor shall he be denied the right to consult, and to be defended by, a legal practitioner of his choice. (2) Every person who is arrested and detained in custody shall be produced before the nearest magistrate within a period of twenty-four hours of such arrest excluding the time necessary for the journey from the place of arrest to the court of the magistrate and no such person shall be detained in custody beyond the said period without the authority of a magistrate.",
    part: "Part III",
    category: "Fundamental Rights",
    summary: "Provides protection against arbitrary arrest and detention",
    relatedArticles: [20, 21]
  },
  {
    number: 23,
    title: "Prohibition of Traffic in Human Beings and Forced Labour",
    content: "(1) Traffic in human beings and begar and other similar forms of forced labour are prohibited and any contravention of this provision shall be an offence punishable in accordance with law. (2) Nothing in this article shall prevent the State from imposing compulsory service for public purposes, and in imposing such service the State shall not make any discrimination on grounds only of religion, race, caste or class or any of them.",
    part: "Part III",
    category: "Fundamental Rights",
    summary: "Prohibits human trafficking and forced labor",
    relatedArticles: [24]
  },
  {
    number: 24,
    title: "Prohibition of Employment of Children in Factories",
    content: "No child below the age of fourteen years shall be employed to work in any factory or mine or engaged in any other hazardous employment.",
    part: "Part III",
    category: "Fundamental Rights",
    summary: "Prohibits employment of children below 14 in hazardous occupations",
    relatedArticles: ["21A", 23]
  },
  {
    number: 25,
    title: "Freedom of Conscience and Free Profession, Practice and Propagation of Religion",
    content: "(1) Subject to public order, morality and health and to the other provisions of this Part, all persons are equally entitled to freedom of conscience and the right freely to profess, practise and propagate religion. (2) Nothing in this article shall affect the operation of any existing law or prevent the State from making any law regulating or restricting any economic, financial, political or other secular activity which may be associated with religious practice.",
    part: "Part III",
    category: "Fundamental Rights",
    summary: "Guarantees freedom of religion including profession, practice and propagation",
    relatedArticles: [26, 27, 28]
  },
  {
    number: 26,
    title: "Freedom to Manage Religious Affairs",
    content: "Subject to public order, morality and health, every religious denomination or any section thereof shall have the right— (a) to establish and maintain institutions for religious and charitable purposes; (b) to manage its own affairs in matters of religion; (c) to own and acquire movable and immovable property; and (d) to administer such property in accordance with law.",
    part: "Part III",
    category: "Fundamental Rights",
    summary: "Grants religious denominations right to manage their own affairs",
    relatedArticles: [25, 27]
  },
  {
    number: 27,
    title: "Freedom as to Payment of Taxes for Promotion of any Particular Religion",
    content: "No person shall be compelled to pay any taxes, the proceeds of which are specifically appropriated in payment of expenses for the promotion or maintenance of any particular religion or religious denomination.",
    part: "Part III",
    category: "Fundamental Rights",
    summary: "Prohibits compelling payment of taxes for promoting any particular religion",
    relatedArticles: [25, 26]
  },
  {
    number: 28,
    title: "Freedom as to Attendance at Religious Instruction or Religious Worship in Certain Educational Institutions",
    content: "(1) No religious instruction shall be provided in any educational institution wholly maintained out of State funds. (2) Nothing in clause (1) shall apply to an educational institution which is administered by the State but has been established under any endowment or trust which requires that religious instruction shall be imparted in such institution.",
    part: "Part III",
    category: "Fundamental Rights",
    summary: "Regulates religious instruction in educational institutions",
    relatedArticles: [25, 26, 27]
  },
  {
    number: 29,
    title: "Protection of Interests of Minorities",
    content: "(1) Any section of the citizens residing in the territory of India or any part thereof having a distinct language, script or culture of its own shall have the right to conserve the same. (2) No citizen shall be denied admission into any educational institution maintained by the State or receiving aid out of State funds on grounds only of religion, race, caste, language or any of them.",
    part: "Part III",
    category: "Fundamental Rights",
    summary: "Protects cultural and educational rights of minorities",
    relatedArticles: [30]
  },
  {
    number: 30,
    title: "Right of Minorities to Establish and Administer Educational Institutions",
    content: "(1) All minorities, whether based on religion or language, shall have the right to establish and administer educational institutions of their choice. (2) The State shall not, in granting aid to educational institutions, discriminate against any educational institution on the ground that it is under the management of a minority, whether based on religion or language.",
    part: "Part III",
    category: "Fundamental Rights",
    summary: "Grants minorities right to establish and administer educational institutions",
    relatedArticles: [29]
  },
  {
    number: 32,
    title: "Remedies for Enforcement of Rights",
    content: "(1) The right to move the Supreme Court by appropriate proceedings for the enforcement of the rights conferred by this Part is guaranteed. (2) The Supreme Court shall have power to issue directions or orders or writs, including writs in the nature of habeas corpus, mandamus, prohibition, quo warranto and certiorari, whichever may be appropriate, for the enforcement of any of the rights conferred by this Part.",
    part: "Part III",
    category: "Fundamental Rights",
    summary: "Provides right to constitutional remedies - the 'soul of the Constitution' according to Dr. Ambedkar",
    relatedArticles: [33, 34, 35, 226]
  },

  // Fundamental Duties (Article 51A)
  {
    number: 51,
    title: "Directive Principles of State Policy",
    content: "The State shall strive to promote the welfare of the people by securing and protecting as effectively as it may a social order in which justice, social, economic and political, shall inform all the institutions of the national life.",
    part: "Part IV",
    category: "Directive Principles",
    summary: "Part of Directive Principles of State Policy",
    relatedArticles: [36, 37, 38]
  },

  // Add more articles for comprehensive coverage
  {
    number: 300,
    title: "Persons Continuing in Service",
    content: "The provisions of this Chapter shall not apply to persons who, having been appointed by the Secretary of State or Secretary of State in Council to a civil service of the Crown in India before the commencement of this Constitution, continue on and after such commencement to serve under the Government of India or of a State.",
    part: "Part XIV",
    category: "Other",
    summary: "Transitional provisions for civil servants",
    relatedArticles: []
  },
  {
    number: "300A",
    title: "Right to Property",
    content: "No person shall be deprived of his property save by authority of law.",
    part: "Part XII",
    category: "Other",
    summary: "Constitutional right to property (moved from Fundamental Rights in 1978)",
    relatedArticles: [21, 31]
  },
  {
    number: 352,
    title: "Proclamation of Emergency",
    content: "(1) If the President is satisfied that a grave emergency exists whereby the security of India or of any part of the territory thereof is threatened, whether by war or external aggression or armed rebellion, he may, by Proclamation, make a declaration to that effect in respect of the whole of India or of such part of the territory thereof as may be specified in the Proclamation.",
    part: "Part XVIII",
    category: "Other",
    summary: "Provides for declaration of National Emergency",
    relatedArticles: [353, 354, 355, 356, 360]
  },
  {
    number: 356,
    title: "Provisions in Case of Failure of Constitutional Machinery in States",
    content: "(1) If the President, on receipt of a report from the Governor of a State or otherwise, is satisfied that a situation has arisen in which the Government of the State cannot be carried on in accordance with the provisions of this Constitution, the President may by Proclamation assume to himself all or any of the functions of the Government of the State.",
    part: "Part XVIII",
    category: "Other",
    summary: "Provides for President's Rule in States",
    relatedArticles: [352, 355]
  },
  {
    number: 370,
    title: "Temporary Provisions with Respect to Jammu and Kashmir",
    content: "(1) Notwithstanding anything in this Constitution, the President may, by public notification, declare that this article shall cease to be operative or shall be operative only with such exceptions and modifications and from such date as he may specify. (2) If the concurrence of the Government of the State referred to in clause (2) be given before the Constituent Assembly for the purpose of framing the Constitution of the State is convened, it shall be placed before such Assembly for such decision as it may take thereon.",
    part: "Part XXI",
    category: "Other",
    summary: "Special status for Jammu and Kashmir (abrogated in 2019)",
    relatedArticles: []
  },
  {
    number: 368,
    title: "Power of Parliament to Amend the Constitution",
    content: "(1) Notwithstanding anything in this Constitution, Parliament may in exercise of its constituent power amend by way of addition, variation or repeal any provision of this Constitution in accordance with the procedure laid down in this article. (2) An amendment of this Constitution may be initiated only by the introduction of a Bill for the purpose in either House of Parliament, and when the Bill is passed in each House by a majority of the total membership of that House and by a majority of not less than two-thirds of the members of that House present and voting, it shall be presented to the President who shall give his assent to the Bill.",
    part: "Part XX",
    category: "Other",
    summary: "Provides procedure for constitutional amendment",
    relatedArticles: []
  }
];

export const fundamentalDuties = [
  {
    number: "51A(a)",
    title: "Duty to Abide by Constitution",
    content: "To abide by the Constitution and respect its ideals and institutions, the National Flag and the National Anthem;"
  },
  {
    number: "51A(b)",
    title: "Duty to Cherish National Ideals",
    content: "To cherish and follow the noble ideals which inspired our national struggle for freedom;"
  },
  {
    number: "51A(c)",
    title: "Duty to Protect Sovereignty",
    content: "To uphold and protect the sovereignty, unity and integrity of India;"
  },
  {
    number: "51A(d)",
    title: "Duty to Defend Country",
    content: "To defend the country and render national service when called upon to do so;"
  },
  {
    number: "51A(e)",
    title: "Duty to Promote Harmony",
    content: "To promote harmony and the spirit of common brotherhood amongst all the people of India transcending religious, linguistic and regional or sectional diversities; to renounce practices derogatory to the dignity of women;"
  },
  {
    number: "51A(f)",
    title: "Duty to Preserve Heritage",
    content: "To value and preserve the rich heritage of our composite culture;"
  },
  {
    number: "51A(g)",
    title: "Duty to Protect Environment",
    content: "To protect and improve the natural environment including forests, lakes, rivers and wild life, and to have compassion for living creatures;"
  },
  {
    number: "51A(h)",
    title: "Duty to Develop Scientific Temper",
    content: "To develop the scientific temper, humanism and the spirit of inquiry and reform;"
  },
  {
    number: "51A(i)",
    title: "Duty to Safeguard Public Property",
    content: "To safeguard public property and to abjure violence;"
  },
  {
    number: "51A(j)",
    title: "Duty to Strive for Excellence",
    content: "To strive towards excellence in all spheres of individual and collective activity so that the nation constantly rises to higher levels of endeavor and achievement;"
  },
  {
    number: "51A(k)",
    title: "Duty of Parent/Guardian to Provide Education",
    content: "Who is a parent or guardian to provide opportunities for education to his child or, as the case may be, ward between the age of six and fourteen years."
  }
];

export const directivePrinciples = [
  {
    article: "38",
    title: "State to Secure Social Order",
    content: "The State shall strive to promote the welfare of the people by securing and protecting as effectively as it may a social order in which justice, social, economic and political, shall inform all the institutions of the national life."
  },
  {
    article: "39",
    title: "Certain Principles of Policy",
    content: "The State shall, in particular, direct its policy towards securing— (a) that the citizens, men and women equally, have the right to an adequate means of livelihood; (b) that the ownership and control of the material resources of the community are so distributed as best to subserve the common good; (c) that the operation of the economic system does not result in the concentration of wealth and means of production to the common detriment; (d) that there is equal pay for equal work for both men and women; (e) that the health and strength of workers, men and women, and the tender age of children are not abused and that citizens are not forced by economic necessity to enter avocations unsuited to their age or strength; (f) that children are given opportunities and facilities to develop in a healthy manner and in conditions of freedom and dignity and that childhood and youth are protected against exploitation and against moral and material abandonment."
  },
  {
    article: "40",
    title: "Organisation of Village Panchayats",
    content: "The State shall take steps to organise village panchayats and endow them with such powers and authority as may be necessary to enable them to function as units of self-government."
  },
  {
    article: "41",
    title: "Right to Work, Education and Public Assistance",
    content: "The State shall, within the limits of its economic capacity and development, make effective provision for securing the right to work, to education and to public assistance in cases of unemployment, old age, sickness and disablement, and in other cases of undeserved want."
  },
  {
    article: "42",
    title: "Provision for Just and Humane Conditions of Work",
    content: "The State shall make provision for securing just and humane conditions of work and for maternity relief."
  },
  {
    article: "43",
    title: "Living Wage for Workers",
    content: "The State shall endeavour to secure, by suitable legislation or economic organisation or in any other way, to all workers, agricultural, industrial or otherwise, work, a living wage, conditions of work ensuring a decent standard of life and full enjoyment of leisure and social and cultural opportunities."
  },
  {
    article: "44",
    title: "Uniform Civil Code",
    content: "The State shall endeavour to secure for the citizens a uniform civil code throughout the territory of India."
  },
  {
    article: "45",
    title: "Provision for Free and Compulsory Education",
    content: "The State shall endeavour to provide, within a period of ten years from the commencement of this Constitution, for free and compulsory education for all children until they complete the age of fourteen years."
  },
  {
    article: "46",
    title: "Promotion of Educational and Economic Interests of Scheduled Castes, Scheduled Tribes and Other Weaker Sections",
    content: "The State shall promote with special care the educational and economic interests of the weaker sections of the people, and, in particular, of the Scheduled Castes and the Scheduled Tribes, and shall protect them from social injustice and all forms of exploitation."
  },
  {
    article: "47",
    title: "Duty of the State to Raise Level of Nutrition",
    content: "The State shall regard the raising of the level of nutrition and the standard of living of its people and the improvement of public health as among its primary duties and, in particular, the State shall endeavour to bring about prohibition of the consumption except for medicinal purposes of intoxicating drinks and of drugs which are injurious to health."
  },
  {
    article: "48",
    title: "Organisation of Agriculture and Animal Husbandry",
    content: "The State shall endeavour to organise agriculture and animal husbandry on modern and scientific lines and shall, in particular, take steps for preserving and improving the breeds, and prohibiting the slaughter, of cows and calves and other milch and draught cattle."
  },
  {
    article: "48A",
    title: "Protection and Improvement of Environment",
    content: "The State shall endeavour to protect and improve the environment and to safeguard the forests and wild life of the country."
  },
  {
    article: "49",
    title: "Protection of Monuments and Places",
    content: "It shall be the obligation of the State to protect every monument or place or object of artistic or historic interest, declared by or under law made by Parliament to be of national importance, from spoliation, disfigurement, destruction, removal, disposal or export, as the case may be."
  },
  {
    article: "50",
    title: "Separation of Judiciary from Executive",
    content: "The State shall take steps to separate the judiciary from the executive in the public services of the State."
  },
  {
    article: "51",
    title: "Promotion of International Peace and Security",
    content: "The State shall endeavour to— (a) promote international peace and security; (b) maintain just and honourable relations between nations; (c) foster respect for international law and treaty obligations in the dealings of organized peoples with one another; and (d) encourage settlement of international disputes by arbitration."
  }
];

export const ipcSections = [
  { section: "302", title: "Punishment for Murder", description: "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.", punishment: "Death or Life Imprisonment + Fine" },
  { section: "304", title: "Punishment for Culpable Homicide", description: "Whoever commits culpable homicide not amounting to murder shall be punished with imprisonment for life, or imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine.", punishment: "Life Imprisonment or up to 10 years + Fine" },
  { section: "306", title: "Abetment of Suicide", description: "If any person commits suicide, whoever abets the commission of such suicide, shall be punished with imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine.", punishment: "Up to 10 years + Fine" },
  { section: "307", title: "Attempt to Murder", description: "Whoever does any act with such intention or knowledge, and under such circumstances that, if he by that act caused death, he would be guilty of murder, shall be punished with imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine.", punishment: "Up to 10 years + Fine" },
  { section: "320", title: "Grievous Hurt", description: "Defines grievous hurt as emasculation, permanent privation of sight, hearing, or any member or joint, destruction or permanent impairing of powers of any member or joint, permanent disfiguration of head or face, fracture or dislocation of bone or tooth, any hurt which endangers life.", punishment: "Varies by section" },
  { section: "354", title: "Assault or Criminal Force to Woman with Intent to Outrage Modesty", description: "Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty, shall be punished with imprisonment of either description for a term which may extend to five years, and shall also be liable to fine.", punishment: "Up to 5 years + Fine" },
  { section: "354A", title: "Sexual Harassment", description: "A man committing any of the following acts: physical contact and advances involving unwelcome and explicit sexual overtures; or a demand or request for sexual favors; or showing pornography against the will of a woman; or making sexually colored remarks.", punishment: "Up to 3 years or 1 year + Fine" },
  { section: "375", title: "Rape", description: "A man is said to commit 'rape' if he penetrates his penis, to any extent, into the vagina, mouth, urethra or anus of a woman or makes her to do so with him or any other person; or inserts, to any extent, any object or a part of the body, not being the penis, into the vagina, the urethra or anus of a woman.", punishment: "Minimum 10 years to Life Imprisonment" },
  { section: "376", title: "Punishment for Rape", description: "Whoever, except in the cases provided for in subsection (2), commits rape, shall be punished with rigorous imprisonment of either description for a term which shall not be less than ten years, but which may extend to imprisonment for life, and shall also be liable to fine.", punishment: "10 years to Life Imprisonment + Fine" },
  { section: "378", title: "Theft", description: "Whoever, intending to take dishonestly any movable property out of the possession of any person without that person's consent, moves that property in order to such taking, is said to commit theft.", punishment: "Up to 3 years or fine or both" },
  { section: "379", title: "Punishment for Theft", description: "Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.", punishment: "Up to 3 years or Fine or Both" },
  { section: "380", title: "Theft in Dwelling House", description: "Whoever commits theft in any building, tent or vessel, which building, tent or vessel is used as a human dwelling, or used for the custody of property, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.", punishment: "Up to 7 years + Fine" },
  { section: "403", title: "Dishonest Misappropriation of Property", description: "Whoever dishonestly misappropriates or converts to his own use movable property, shall be punished with imprisonment of either description for a term which may extend to two years, or with fine, or with both.", punishment: "Up to 2 years or Fine or Both" },
  { section: "406", title: "Punishment for Criminal Breach of Trust", description: "Whoever commits criminal breach of trust shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.", punishment: "Up to 3 years or Fine or Both" },
  { section: "420", title: "Cheating and Dishonestly Inducing Delivery of Property", description: "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.", punishment: "Up to 7 years + Fine" },
  { section: "441", title: "Criminal Trespass", description: "Whoever enters into or upon property in the possession of another with intent to commit an offence or to intimidate, insult or annoy any person in possession of such property, or having lawfully entered into or upon such property, unlawfully remains there with intent thereby to intimidate, insult or annoy any such person, or with intent to commit an offence, is said to commit 'criminal trespass'.", punishment: "Up to 3 months or Fine up to ₹500" },
  { section: "447", title: "Punishment for Criminal Trespass", description: "Whoever commits criminal trespass shall be punished with imprisonment of either description for a term which may extend to three months, or with fine which may extend to five hundred rupees, or with both.", punishment: "Up to 3 months or ₹500 Fine or Both" },
  { section: "448", title: "House-breaking", description: "Whoever commits house-breaking shall be punished with imprisonment of either description for a term which may extend to two years, and shall also be liable to fine.", punishment: "Up to 2 years + Fine" },
  { section: "463", title: "Forgery", description: "Whoever makes any false documents or false electronic record or part of a document or electronic record, with intent to cause damage or injury, to the public or to any person, or to support any claim or title, or to cause any person to part with property, or to enter into any express or implied contract, or with intent to commit fraud or that fraud may be committed, commits forgery.", punishment: "Up to 2 years or Fine or Both" },
  { section: "464", title: "Making False Document", description: "A person is said to make a false document or false electronic record who dishonestly or fraudulently makes, signs, seals or executes a document or part of a document or electronic record or makes any mark denoting the execution of a document or electronic record with the intention of causing it to be believed that such document or part of document or electronic record was made, signed, sealed or executed by or by the authority of a person by whom or by whose authority he knows that it was not made, signed, sealed or executed.", punishment: "Varies by case" },
  { section: "465", title: "Punishment for Forgery", description: "Whoever commits forgery shall be punished with imprisonment of either description for a term which may extend to two years, or with fine, or with both.", punishment: "Up to 2 years or Fine or Both" },
  { section: "467", title: "Forgery of Valuable Security, Will, etc.", description: "Whoever forges a document which purports to be a valuable security or a will, or an authority to adopt a son, or which purports to give authority to any person to make or transfer any valuable security, or to receive the principal, interest or dividends thereon, or to receive or deliver any money, movable property, or valuable security, or any will or authority to adopt a son, or any endorsement on any valuable security, shall be punished with imprisonment for life, or with imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine.", punishment: "Life Imprisonment or up to 10 years + Fine" },
  { section: "468", title: "Forgery for Purpose of Cheating", description: "Whoever commits forgery, intending that the document or electronic record forged shall be used for the purpose of cheating, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.", punishment: "Up to 7 years + Fine" },
  { section: "471", title: "Using as Genuine a Forged Document or Electronic Record", description: "Whoever fraudulently or dishonestly uses as genuine any document or electronic record which he knows or has reason to believe to be a forged document or electronic record, shall be punished in the same manner as if he had forged such document or electronic record.", punishment: "Same as forgery" },
  { section: "498A", title: "Husband or Relative of Husband Subjecting Woman to Cruelty", description: "Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine.", punishment: "Up to 3 years + Fine" },
  { section: "499", title: "Defamation", description: "Whoever, by words either spoken or intended to be read, or by signs or by visible representations, makes or publishes any imputation concerning any person intending to harm, or knowing or having reason to believe that such imputation will harm, the reputation of such person, is said, except in the cases hereinafter expected, to defame that person.", punishment: "Up to 2 years or Fine or Both" },
  { section: "500", title: "Punishment for Defamation", description: "Whoever defames another shall be punished with simple imprisonment for a term which may extend to two years, or with fine, or with both.", punishment: "Up to 2 years or Fine or Both" },
  { section: "503", title: "Criminal Intimidation", description: "Whoever threatens another with any injury to his person, reputation or property, or to the person or reputation of any one in whom that person is interested, with intent to cause alarm to that person, or to cause that person to do any act which he is not legally bound to do, or to omit to do any act which that person is legally entitled to do, as the means of avoiding the execution of such threat, commits criminal intimidation.", punishment: "Up to 2 years or Fine or Both" },
  { section: "506", title: "Punishment for Criminal Intimidation", description: "Whoever commits the offence of criminal intimidation shall be punished with imprisonment of either description for a term which may extend to two years, or with fine, or with both; and if the threat be to cause death or grievous hurt, or to cause the destruction of any property by fire, or to cause an offence punishable with death or imprisonment for life, or with imprisonment for a term which may extend to seven years, or to impute unchastity to a woman, shall be punished with imprisonment of either description for a term which may extend to seven years, or with fine, or with both.", punishment: "Up to 2 years or 7 years + Fine" },
  { section: "509", title: "Word, Gesture or Act Intended to Insult Modesty of Woman", description: "Whoever, intending to insult the modesty of any woman, utters any word, makes any sound or gesture, or exhibits any object, intending that such word or sound shall be heard, or that such gesture or object shall be seen, by such woman, or intrudes upon the privacy of such woman, shall be punished with simple imprisonment for a term which may extend to three years, and also with fine.", punishment: "Up to 3 years + Fine" },
  { section: "511", title: "Punishment for Attempting to Commit Offences", description: "Whoever attempts to commit an offence punishable by this Code with imprisonment for life or imprisonment, or to cause such an offence to be committed, and in such attempt does any act towards the commission of the offence, shall, where no express provision is made by this Code for the punishment of such attempt, be punished with imprisonment of any description provided for the offence, for a term which may extend to one-half of the imprisonment for life or, as the case may be, one-half of the longest term of imprisonment provided for that offence, or with such fine as is provided for the offence, or with both.", punishment: "Half of full punishment" }
];

export const precedentCases = [
  {
    title: "Kesavananda Bharati v. State of Kerala (1973)",
    citation: "AIR 1973 SC 1464",
    bench: "13 Judges",
    summary: "Established the Basic Structure Doctrine of the Constitution. Held that Parliament can amend the Constitution but cannot alter its basic structure.",
    significance: "Landmark judgment that limited Parliament's amending power",
    relatedArticles: [368, 13, 14, 21, 32],
    outcome: "Basic Structure Doctrine established"
  },
  {
    title: "Maneka Gandhi v. Union of India (1978)",
    citation: "AIR 1978 SC 597",
    bench: "7 Judges",
    summary: "Expanded the interpretation of Article 21. Held that the right to life includes the right to live with human dignity and all that goes along with it, including the right to travel abroad.",
    significance: "Broadened the scope of Article 21 - Right to Life and Personal Liberty",
    relatedArticles: [21, 14, 19],
    outcome: "Passport impoundment struck down"
  },
  {
    title: "Vishaka v. State of Rajasthan (1997)",
    citation: "AIR 1997 SC 3011",
    bench: "3 Judges",
    summary: "Recognized sexual harassment at workplace as a violation of fundamental rights. Laid down guidelines (Vishaka Guidelines) for preventing and redressing sexual harassment until legislation is enacted.",
    significance: "Led to the enactment of Sexual Harassment of Women at Workplace Act, 2013",
    relatedArticles: [14, 15, 19, 21],
    outcome: "Vishaka Guidelines laid down"
  },
  {
    title: "Puttaswamy v. Union of India (2017)",
    citation: "(2017) 10 SCC 1",
    bench: "9 Judges",
    summary: "Unanimously held that the right to privacy is a fundamental right under Article 21. Overruled MP Sharma (1954) and Kharak Singh (1962) cases.",
    significance: "Recognized Right to Privacy as a fundamental right",
    relatedArticles: [21, 19, 14],
    outcome: "Right to Privacy is fundamental right"
  },
  {
    title: "Navtej Singh Johar v. Union of India (2018)",
    citation: "(2018) 10 SCC 1",
    bench: "5 Judges",
    summary: "Decriminalized consensual homosexual acts between adults by striking down Section 377 IPC to the extent it criminalized consensual sexual conduct between adults of the same sex.",
    significance: "LGBTQ+ rights milestone in India",
    relatedArticles: [14, 15, 19, 21],
    outcome: "Section 377 decriminalized"
  },
  {
    title: "Joseph Shine v. Union of India (2018)",
    citation: "(2019) 3 SCC 39",
    bench: "5 Judges",
    summary: "Struck down Section 497 IPC (adultery) as unconstitutional. Held that adultery is not an offence and is a private matter between individuals.",
    significance: "Decriminalized adultery, recognized women's autonomy",
    relatedArticles: [14, 15, 21],
    outcome: "Section 497 struck down"
  },
  {
    title: "Sabarimala Temple Entry (2018)",
    citation: "(2018) 11 SCC 1",
    bench: "5 Judges",
    summary: "Allowed entry of women of all ages into Sabarimala temple. Held that the custom prohibiting women of menstruating age from entering the temple violated Article 25 and was discriminatory.",
    significance: "Gender equality in religious practices",
    relatedArticles: [25, 14, 15],
    outcome: "Women allowed entry (review pending)"
  },
  {
    title: "Aadhaar Case (2019)",
    citation: "(2019) 1 SCC 1",
    bench: "5 Judges",
    summary: "Upheld the constitutional validity of Aadhaar Act but struck down certain provisions. Held that Aadhaar does not violate right to privacy when used for welfare schemes.",
    significance: "Balanced national interest with privacy rights",
    relatedArticles: [21, 14, 19],
    outcome: "Aadhaar upheld with restrictions"
  },
  {
    title: "Ayodhya Verdict (2019)",
    citation: "(2020) 1 SCC 1",
    bench: "5 Judges",
    summary: "Unanimous verdict on the Ram Janmabhoomi-Babri Masjid dispute. Held that the Hindu parties have title over the disputed land. Directed the government to allot 5 acres of alternate land to Muslims.",
    significance: "Historic resolution of decades-old dispute",
    relatedArticles: [25, 26, 14],
    outcome: "Temple to be built, alternate land for mosque"
  },
  {
    title: "Maratha Reservation Case (2021)",
    citation: "(2021) 8 SCC 1",
    bench: "5 Judges",
    summary: "Struck down Maharashtra law providing reservation to Marathas. Held that the 50% cap on reservation laid down in Indra Sawhney case is binding.",
    significance: "Affirmed 50% cap on reservations",
    relatedArticles: [16, 14, 15],
    outcome: "Maratha reservation struck down"
  },
  {
    title: "Right to Die with Dignity (2018)",
    citation: "(2018) 5 SCC 1",
    bench: "5 Judges",
    summary: "Recognized the right to die with dignity as a fundamental right under Article 21. Legalized passive euthanasia and advance medical directives (living wills).",
    significance: "Legalized passive euthanasia in India",
    relatedArticles: [21, 14],
    outcome: "Passive euthanasia legalized"
  },
  {
    title: "Triple Talaq Case (2017)",
    citation: "(2017) 9 SCC 1",
    bench: "5 Judges",
    summary: "Held that instantaneous triple talaq (talaq-e-biddat) is unconstitutional and violates Article 14. The practice was not protected under Article 25.",
    significance: "Muslim women's rights protection",
    relatedArticles: [14, 15, 25],
    outcome: "Triple talaq declared unconstitutional"
  },
  {
    title: "NJAC Case (2015)",
    citation: "(2015) 11 SCC 1",
    bench: "5 Judges",
    summary: "Struck down the 99th Constitutional Amendment and National Judicial Appointments Commission Act. Held that the collegium system for appointment of judges is part of the basic structure.",
    significance: "Judicial independence protected",
    relatedArticles: [124, 217, 50, 368],
    outcome: "NJAC struck down, collegium restored"
  },
  {
    title: "Lily Thomas v. Union of India (2013)",
    citation: "(2013) 7 SCC 653",
    bench: "2 Judges",
    summary: "Struck down Section 8(4) of Representation of People Act which allowed convicted legislators to continue in office if they filed an appeal. Automatic disqualification upon conviction.",
    significance: "Clean politics initiative",
    relatedArticles: [102, 191],
    outcome: "Automatic disqualification of convicted MPs/MLAs"
  },
  {
    title: "Vodafone Case (2012)",
    citation: "(2012) 6 SCC 613",
    bench: "3 Judges",
    summary: "Held that Indian tax authorities do not have jurisdiction over offshore transactions between foreign companies. The transaction was not taxable in India.",
    significance: "International taxation precedent",
    relatedArticles: [265, 14],
    outcome: "Vodafone won the case"
  }
];

export const caseStudies = [
  {
    id: 1,
    title: "Property Dispute Resolution",
    category: "Civil Law",
    summary: "A complex property dispute involving multiple heirs and unclear title deeds spanning three generations.",
    facts: "The property in question was ancestral land in Maharashtra passed down through generations without proper documentation. Multiple claimants emerged after the death of the last known owner in 2015.",
    issues: [
      "Determination of rightful heirs",
      "Validity of oral partition claims",
      "Adverse possession claims by some parties",
      "Encroachment by third parties"
    ],
    analysis: "The case required examination of revenue records, family genealogy, and application of Hindu Succession Act provisions. The court had to balance traditional inheritance customs with statutory law.",
    outcome: "Court ordered partition by metes and bounds, recognizing all legal heirs. Directed registration of clear title deeds.",
    keyTakeaways: [
      "Importance of proper documentation in property transactions",
      "Statutory law prevails over customary practices",
      "Courts prefer physical partition over sale where possible"
    ],
    relevantLaws: ["Hindu Succession Act, 1956", "Transfer of Property Act, 1882", "Registration Act, 1908"],
    timeline: "2016-2021 (5 years)"
  },
  {
    id: 2,
    title: "Startup Founder Agreement Breach",
    category: "Commercial Law",
    summary: "Dispute between co-founders of a tech startup regarding IP ownership and vesting of shares.",
    facts: "Three co-founders established a fintech startup in 2019 with equal equity split. Dispute arose when one founder left and claimed full ownership of the core algorithm he developed.",
    issues: [
      "IP ownership in absence of clear assignment",
      "Enforceability of vesting clauses",
      "Fiduciary duties of founders",
      "Valuation of company during buyout"
    ],
    analysis: "The case examined the founder agreement, employment contracts, and principles of intellectual property law in employment contexts. Section 17 of Copyright Act was crucial.",
    outcome: "Court held IP belongs to company as it was developed during employment for company's business. Ordered specific performance of vesting agreement.",
    keyTakeaways: [
      "Clear IP assignment clauses essential in founder agreements",
      "Vesting schedules protect against premature exits",
      "Employment context determines IP ownership"
    ],
    relevantLaws: ["Indian Contract Act, 1872", "Copyright Act, 1957", "Companies Act, 2013"],
    timeline: "2020-2022 (2 years)"
  },
  {
    id: 3,
    title: "Medical Negligence - Surgical Error",
    category: "Tort Law",
    summary: "Patient suffered permanent disability due to wrong-site surgery performed in a private hospital.",
    facts: "Patient was scheduled for knee replacement on left knee. Surgery was performed on right knee due to administrative error in patient identification.",
    issues: [
      "Standard of care in pre-operative protocols",
      "Vicarious liability of hospital",
      "Quantum of damages for permanent disability",
      "Contributory negligence defense"
    ],
    analysis: "Court examined hospital protocols, WHO surgical safety checklist implementation, and precedents on medical negligence. Bolam test applied for standard of care.",
    outcome: "Hospital found negligent. Awarded ₹50 lakhs compensation including for loss of earning capacity, pain and suffering.",
    keyTakeaways: [
      "Strict adherence to safety protocols mandatory",
      "Hospitals vicariously liable for staff negligence",
      "Damages include non-pecuniary losses"
    ],
    relevantLaws: ["Consumer Protection Act, 2019", "Indian Contract Act, 1872", "Bolam Principle"],
    timeline: "2018-2021 (3 years)"
  },
  {
    id: 4,
    title: "Environmental Clearance Violation",
    category: "Environmental Law",
    summary: "Construction project started without proper environmental clearance, affecting wetland area.",
    facts: "Real estate developer began construction of residential complex in ecologically sensitive zone without obtaining Environmental Clearance from MoEFCC.",
    issues: [
      "Applicability of EIA Notification, 2006",
      "Wetland protection under environmental laws",
      "Doctrine of sustainable development",
      "Remedy - demolition vs. penalty"
    ],
    analysis: "Court applied precautionary principle and polluter pays principle. Examined CRZ notification applicability and wetland conservation rules.",
    outcome: "Construction halted. Developer fined ₹10 crores for restoration. Ordered to obtain EC before resuming.",
    keyTakeaways: [
      "Environmental clearance mandatory before commencement",
      "Precautionary principle applied in environmental cases",
      "Cost of restoration borne by polluter"
    ],
    relevantLaws: ["Environment Protection Act, 1986", "EIA Notification, 2006", "Wetland Conservation Rules, 2017"],
    timeline: "2019-2022 (3 years)"
  },
  {
    id: 5,
    title: "Cyber Crime - Identity Theft",
    category: "Cyber Law",
    summary: "Victim's identity stolen to create fake social media profiles and defraud multiple people.",
    facts: "Accused obtained victim's Aadhaar and PAN details through phishing, created fake profiles on matrimonial sites, and defrauded prospective matches of ₹25 lakhs.",
    issues: [
      "Jurisdiction in cyber crimes",
      "Liability of intermediaries",
      "Admissibility of electronic evidence",
      "Identity theft as distinct offense"
    ],
    analysis: "Court examined Section 66C (identity theft) and 66D (cheating by impersonation) of IT Act. Also looked at intermediary liability under Section 79.",
    outcome: "Accused convicted under IT Act and IPC. Sentenced to 7 years imprisonment. Intermediaries directed to verify identities.",
    keyTakeaways: [
      "Identity theft is distinct criminal offense",
      "Electronic evidence admissible with proper certification",
      "Intermediaries have due diligence obligations"
    ],
    relevantLaws: ["Information Technology Act, 2000", "Indian Penal Code, 1860", "Indian Evidence Act, 1872"],
    timeline: "2020-2023 (3 years)"
  },
  {
    id: 6,
    title: "Labour Dispute - Unfair Termination",
    category: "Labour Law",
    summary: "Senior employee terminated allegedly for raising safety concerns in manufacturing unit.",
    facts: "Employee with 15 years service terminated after reporting safety violations to factory inspector. Employer claimed redundancy due to automation.",
    issues: [
      "Mala fide termination vs. genuine redundancy",
      "Protection under whistleblower laws",
      "Reinstatement vs. compensation",
      "Back wages calculation"
    ],
    analysis: "Industrial tribunal examined timing of termination, past record, and actual automation implementation. Applied principles from recent labour code amendments.",
    outcome: "Termination held mala fide. Ordered reinstatement with full back wages and continuity of service.",
    keyTakeaways: [
      "Timing and motive crucial in termination disputes",
      "Whistleblower protection under labour laws",
      "Reinstatement preferred remedy for unfair termination"
    ],
    relevantLaws: ["Industrial Disputes Act, 1947", "Factories Act, 1948", "Code on Industrial Relations, 2020"],
    timeline: "2019-2022 (3 years)"
  }
];

export const legalFAQs = [
  {
    question: "What are Fundamental Rights?",
    answer: "Fundamental Rights are basic human rights guaranteed by the Constitution of India to all citizens. They are enshrined in Part III (Articles 12-35) and include Right to Equality, Right to Freedom, Right against Exploitation, Right to Freedom of Religion, Cultural and Educational Rights, and Right to Constitutional Remedies. These rights are justiciable, meaning you can approach the courts if they are violated."
  },
  {
    question: "What is Article 21?",
    answer: "Article 21 states 'No person shall be deprived of his life or personal liberty except according to procedure established by law.' It is the heart of the Fundamental Rights. The Supreme Court has interpreted 'Right to Life' broadly to include Right to Privacy, Right to Clean Environment, Right to Education, Right to Health, Right to Livelihood, Right to Shelter, and Right to Die with Dignity (passive euthanasia)."
  },
  {
    question: "What is the Right to Equality?",
    answer: "The Right to Equality (Articles 14-18) guarantees: (1) Equality before law (Article 14) - no one is above law; (2) No discrimination on grounds of religion, race, caste, sex, place of birth (Article 15); (3) Equal opportunity in public employment (Article 16); (4) Abolition of untouchability (Article 17); (5) Abolition of titles (Article 18). However, the State can make special provisions for women, children, SC/ST, and backward classes."
  },
  {
    question: "What are Directive Principles of State Policy?",
    answer: "Directive Principles of State Policy (Part IV, Articles 36-51) are guidelines for the government to ensure social and economic democracy. Unlike Fundamental Rights, they are not enforceable by courts but are fundamental in governance. They include principles like equal pay for equal work, free legal aid, uniform civil code, village panchayats, protection of environment, and international peace."
  },
  {
    question: "What is the difference between IPC and CrPC?",
    answer: "IPC (Indian Penal Code, 1860) is the substantive law that defines offenses (like murder, theft, rape) and prescribes punishments. CrPC (Code of Criminal Procedure, 1973) is the procedural law that lays down the procedure for investigation, arrest, bail, trial, and appeal. Think of IPC as 'what is the crime and punishment' and CrPC as 'how to handle the crime procedurally.'"
  },
  {
    question: "What is the punishment for murder in India?",
    answer: "Under Section 302 IPC, whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine. Death penalty is awarded only in the 'rarest of rare cases' as per the Bachan Singh judgment. The court considers factors like manner of commission, motive, anti-social nature, and personality of victim while deciding between death and life imprisonment."
  },
  {
    question: "What is the legal marriage age in India?",
    answer: "As of 2021, the legal age for marriage is 21 years for males and 18 years for females. The Prohibition of Child Marriage Act, 2006 prohibits marriage where either party is under these ages. However, the government has proposed raising the marriage age for females to 21 years to ensure gender parity (Prohibition of Child Marriage (Amendment) Bill, 2021)."
  },
  {
    question: "What is domestic violence under law?",
    answer: "Under the Protection of Women from Domestic Violence Act, 2005, domestic violence includes physical abuse, sexual abuse, verbal and emotional abuse, and economic abuse by any adult male against a woman who is or was in a domestic relationship (wife, live-in partner, sister, mother, etc.). The Act provides civil remedies like protection orders, residence orders, monetary relief, and custody orders."
  },
  {
    question: "How to file an FIR?",
    answer: "FIR (First Information Report) can be filed under Section 154 CrPC: (1) Go to the police station having jurisdiction over the crime location; (2) Provide details of the offense orally or in writing; (3) Police must register the FIR if cognizable offense; (4) Get a free copy of FIR; (5) If police refuse, you can approach Superintendent of Police, Judicial Magistrate, or file online FIR in many states. You can also file a 'Zero FIR' at any police station regardless of jurisdiction."
  },
  {
    question: "What is bail and how to get it?",
    answer: "Bail is the release of an accused from custody pending trial. Types include: (1) Regular bail - after arrest (Section 437, 439 CrPC); (2) Anticipatory bail - before arrest (Section 438 CrPC); (3) Interim bail - temporary relief. For bailable offenses, bail is a right. For non-bailable offenses, court considers nature of offense, evidence, likelihood of fleeing, and tampering with evidence."
  },
  {
    question: "What is the right to property?",
    answer: "Originally a Fundamental Right (Article 31), the Right to Property was removed from Part III by the 44th Amendment in 1978 and made a constitutional right under Article 300A. It states 'No person shall be deprived of his property save by authority of law.' While you cannot directly move Supreme Court under Article 32 for violation, you can approach High Courts under Article 226 or file civil suits."
  },
  {
    question: "What is Public Interest Litigation (PIL)?",
    answer: "PIL is a litigation filed in public interest where the petitioner may not be directly affected. Introduced by Justice PN Bhagwati, it allows any public-spirited person or organization to approach courts for enforcement of constitutional or legal rights of weaker sections. PILs can be filed for issues like environmental protection, human rights, consumer protection, and good governance."
  }
];

export interface ConstitutionPart {
  key: string;
  part: string;
  title: string;
  articleRangeLabel: string;
  category: Article['category'];
  description: string;
  repealed?: boolean;
  articles: Article[];
}

export interface ConstitutionSchedule {
  number: number;
  title: string;
  relatedArticles: string;
  description: string;
}

interface ConstitutionPartDefinition {
  key: string;
  part: string;
  title: string;
  articleRangeLabel: string;
  category: Article['category'];
  description: string;
  repealed?: boolean;
  articleIds: Array<number | string>;
}

const normalizeArticleKey = (value: number | string) => String(value).replace(/\s+/g, '').toUpperCase();

const createNumericRange = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

const createAlphaRange = (
  base: number,
  startLetter: string,
  endLetter: string,
  includeBase = false
) => {
  const articleIds: Array<number | string> = includeBase ? [base] : [];

  for (
    let code = startLetter.charCodeAt(0);
    code <= endLetter.charCodeAt(0);
    code += 1
  ) {
    articleIds.push(`${base}${String.fromCharCode(code)}`);
  }

  return articleIds;
};

const combineArticleIds = (...groups: Array<Array<number | string>>) => groups.flat();

const directivePrincipleArticles: Article[] = [
  {
    number: 36,
    title: 'Definition',
    content: 'In this Part, unless the context otherwise requires, "the State" has the same meaning as in Part III.',
    part: 'Part IV',
    category: 'Directive Principles',
    summary: 'Defines "State" for the Directive Principles of State Policy.',
    relatedArticles: [12, 37]
  },
  {
    number: 37,
    title: 'Application of the Principles Contained in this Part',
    content: 'The provisions contained in this Part shall not be enforceable by any court, but the principles laid down are nevertheless fundamental in the governance of the country and it shall be the duty of the State to apply these principles in making laws.',
    part: 'Part IV',
    category: 'Directive Principles',
    summary: 'Makes Directive Principles non-justiciable but fundamental in governance.',
    relatedArticles: [36, 38]
  },
  ...directivePrinciples.map((principle) => ({
    number: principle.article,
    title: principle.title,
    content: principle.content,
    part: 'Part IV',
    category: 'Directive Principles' as const,
    summary: principle.content,
    relatedArticles: []
  }))
];

const fundamentalDutyArticles: Article[] = fundamentalDuties.map((duty) => ({
  number: duty.number,
  title: duty.title,
  content: duty.content,
  part: 'Part IVA',
  category: 'Fundamental Duties' as const,
  summary: duty.content,
  relatedArticles: []
}));

const constitutionArticleMap = new Map<string, Article>();

[...constitutionArticles, ...directivePrincipleArticles, ...fundamentalDutyArticles].forEach((article) => {
  constitutionArticleMap.set(normalizeArticleKey(article.number), article);
});

const constitutionPartDefinitions: ConstitutionPartDefinition[] = [
  {
    key: 'part-i',
    part: 'Part I',
    title: 'The Union and its Territory',
    articleRangeLabel: 'Articles 1-4',
    category: 'Other',
    description: 'Defines India as a Union and covers its territory, states, and reorganisation.',
    articleIds: createNumericRange(1, 4)
  },
  {
    key: 'part-ii',
    part: 'Part II',
    title: 'Citizenship',
    articleRangeLabel: 'Articles 5-11',
    category: 'Other',
    description: 'Lays down constitutional rules on citizenship at the commencement of the Constitution.',
    articleIds: createNumericRange(5, 11)
  },
  {
    key: 'part-iii',
    part: 'Part III',
    title: 'Fundamental Rights',
    articleRangeLabel: 'Articles 12-35',
    category: 'Fundamental Rights',
    description: 'Guarantees enforceable civil liberties, equality, freedoms, and constitutional remedies.',
    articleIds: createNumericRange(12, 35)
  },
  {
    key: 'part-iv',
    part: 'Part IV',
    title: 'Directive Principles of State Policy',
    articleRangeLabel: 'Articles 36-51',
    category: 'Directive Principles',
    description: 'Contains non-justiciable principles that guide governance and social welfare policy.',
    articleIds: createNumericRange(36, 51)
  },
  {
    key: 'part-iva',
    part: 'Part IVA',
    title: 'Fundamental Duties',
    articleRangeLabel: 'Article 51A',
    category: 'Fundamental Duties',
    description: 'Lists the constitutional duties expected from every citizen.',
    articleIds: ['51A']
  },
  {
    key: 'part-v',
    part: 'Part V',
    title: 'The Union',
    articleRangeLabel: 'Articles 52-151',
    category: 'Other',
    description: 'Covers the President, Parliament, Union judiciary, and the Comptroller and Auditor General.',
    articleIds: createNumericRange(52, 151)
  },
  {
    key: 'part-vi',
    part: 'Part VI',
    title: 'The States',
    articleRangeLabel: 'Articles 152-237',
    category: 'Other',
    description: 'Provides the constitutional framework for State executives, legislatures, and High Courts.',
    articleIds: createNumericRange(152, 237)
  },
  {
    key: 'part-vii',
    part: 'Part VII',
    title: 'States in Part B of the First Schedule',
    articleRangeLabel: 'Article 238',
    category: 'Other',
    description: 'Originally dealt with Part B States and now stands repealed.',
    repealed: true,
    articleIds: [238]
  },
  {
    key: 'part-viii',
    part: 'Part VIII',
    title: 'The Union Territories',
    articleRangeLabel: 'Articles 239-242',
    category: 'Other',
    description: 'Addresses administration of Union Territories and related constitutional arrangements.',
    articleIds: createNumericRange(239, 242)
  },
  {
    key: 'part-ix',
    part: 'Part IX',
    title: 'The Panchayats',
    articleRangeLabel: 'Articles 243-243O',
    category: 'Other',
    description: 'Introduces the constitutional framework for Panchayati Raj institutions.',
    articleIds: createAlphaRange(243, 'A', 'O', true)
  },
  {
    key: 'part-ixa',
    part: 'Part IXA',
    title: 'The Municipalities',
    articleRangeLabel: 'Articles 243P-243ZG',
    category: 'Other',
    description: 'Provides for urban local bodies including municipalities and municipal governance.',
    articleIds: [
      '243P',
      '243Q',
      '243R',
      '243S',
      '243T',
      '243U',
      '243V',
      '243W',
      '243X',
      '243Y',
      '243Z',
      '243ZA',
      '243ZB',
      '243ZC',
      '243ZD',
      '243ZE',
      '243ZF',
      '243ZG'
    ]
  },
  {
    key: 'part-ixb',
    part: 'Part IXB',
    title: 'The Co-operative Societies',
    articleRangeLabel: 'Articles 243ZH-243ZT',
    category: 'Other',
    description: 'Sets constitutional principles for co-operative societies.',
    articleIds: [
      '243ZH',
      '243ZI',
      '243ZJ',
      '243ZK',
      '243ZL',
      '243ZM',
      '243ZN',
      '243ZO',
      '243ZP',
      '243ZQ',
      '243ZR',
      '243ZS',
      '243ZT'
    ]
  },
  {
    key: 'part-x',
    part: 'Part X',
    title: 'The Scheduled and Tribal Areas',
    articleRangeLabel: 'Articles 244-244A',
    category: 'Other',
    description: 'Deals with administration of Scheduled Areas and Tribal Areas.',
    articleIds: [244, '244A']
  },
  {
    key: 'part-xi',
    part: 'Part XI',
    title: 'Relations between the Union and the States',
    articleRangeLabel: 'Articles 245-263',
    category: 'Other',
    description: 'Explains legislative and administrative relations between the Union and the States.',
    articleIds: createNumericRange(245, 263)
  },
  {
    key: 'part-xii',
    part: 'Part XII',
    title: 'Finance, Property, Contracts and Suits',
    articleRangeLabel: 'Articles 264-300A',
    category: 'Other',
    description: 'Covers public finance, taxation, borrowing, property, and contractual matters.',
    articleIds: combineArticleIds(createNumericRange(264, 300), ['300A'])
  },
  {
    key: 'part-xiii',
    part: 'Part XIII',
    title: 'Trade, Commerce and Intercourse within the Territory of India',
    articleRangeLabel: 'Articles 301-307',
    category: 'Other',
    description: 'Protects trade and commerce while allowing limited restrictions in public interest.',
    articleIds: createNumericRange(301, 307)
  },
  {
    key: 'part-xiv',
    part: 'Part XIV',
    title: 'Services under the Union and the States',
    articleRangeLabel: 'Articles 308-323',
    category: 'Other',
    description: 'Contains constitutional rules for public services and public service commissions.',
    articleIds: combineArticleIds(createNumericRange(308, 312), ['312A'], createNumericRange(313, 323))
  },
  {
    key: 'part-xiva',
    part: 'Part XIVA',
    title: 'Tribunals',
    articleRangeLabel: 'Articles 323A-323B',
    category: 'Other',
    description: 'Enables creation of administrative and other tribunals.',
    articleIds: ['323A', '323B']
  },
  {
    key: 'part-xv',
    part: 'Part XV',
    title: 'Elections',
    articleRangeLabel: 'Articles 324-329A',
    category: 'Other',
    description: 'Provides the constitutional framework for elections and the Election Commission of India.',
    articleIds: combineArticleIds(createNumericRange(324, 329), ['329A'])
  },
  {
    key: 'part-xvi',
    part: 'Part XVI',
    title: 'Special Provisions relating to Certain Classes',
    articleRangeLabel: 'Articles 330-342A',
    category: 'Other',
    description: 'Contains reservation, representation, and safeguards for certain classes.',
    articleIds: combineArticleIds(
      createNumericRange(330, 338),
      ['338A', '338B'],
      createNumericRange(339, 342),
      ['342A']
    )
  },
  {
    key: 'part-xvii',
    part: 'Part XVII',
    title: 'Official Language',
    articleRangeLabel: 'Articles 343-351',
    category: 'Other',
    description: 'Deals with official language of the Union, States, and courts.',
    articleIds: combineArticleIds(createNumericRange(343, 350), ['350A', '350B', 351])
  },
  {
    key: 'part-xviii',
    part: 'Part XVIII',
    title: 'Emergency Provisions',
    articleRangeLabel: 'Articles 352-360',
    category: 'Other',
    description: 'Governs national, state, and financial emergencies.',
    articleIds: createNumericRange(352, 360)
  },
  {
    key: 'part-xix',
    part: 'Part XIX',
    title: 'Miscellaneous',
    articleRangeLabel: 'Articles 361-367',
    category: 'Other',
    description: 'Contains protections, definitions, and miscellaneous constitutional provisions.',
    articleIds: createNumericRange(361, 367)
  },
  {
    key: 'part-xx',
    part: 'Part XX',
    title: 'Amendment of the Constitution',
    articleRangeLabel: 'Article 368',
    category: 'Other',
    description: 'Lays down the procedure for amending the Constitution.',
    articleIds: [368]
  },
  {
    key: 'part-xxi',
    part: 'Part XXI',
    title: 'Temporary, Transitional and Special Provisions',
    articleRangeLabel: 'Articles 369-392',
    category: 'Other',
    description: 'Contains temporary and special constitutional arrangements for particular States and matters.',
    articleIds: createNumericRange(369, 392)
  },
  {
    key: 'part-xxii',
    part: 'Part XXII',
    title: 'Short Title, Commencement, Authoritative Text in Hindi and Repeals',
    articleRangeLabel: 'Articles 393-395',
    category: 'Other',
    description: 'Contains concluding provisions including commencement and repeal.',
    articleIds: createNumericRange(393, 395)
  }
];

const createPlaceholderArticle = (
  articleId: number | string,
  partDefinition: ConstitutionPartDefinition
): Article => ({
  number: articleId,
  title: `Article ${articleId}`,
  content: `This constitutional provision belongs to ${partDefinition.part} (${partDefinition.title}). This explorer includes the full constitutional structure locally and detailed text for the most commonly referenced articles. Use the Ask About Constitution panel for a guided explanation, or consult the official bare text for authoritative wording.`,
  part: partDefinition.part,
  category: partDefinition.category,
  summary: `${partDefinition.title} provision within ${partDefinition.articleRangeLabel}.`,
  relatedArticles: []
});

export const constitutionParts: ConstitutionPart[] = constitutionPartDefinitions.map((partDefinition) => ({
  ...partDefinition,
  articles: partDefinition.articleIds.map((articleId) => {
    const detailedArticle = constitutionArticleMap.get(normalizeArticleKey(articleId));
    return detailedArticle || createPlaceholderArticle(articleId, partDefinition);
  })
}));

export const constitutionExplorerArticles: Article[] = constitutionParts.flatMap((part) => part.articles);

export const constitutionSchedules: ConstitutionSchedule[] = [
  {
    number: 1,
    title: 'States and Union Territories',
    relatedArticles: 'Articles 1 and 4',
    description: 'Lists States, Union Territories, and territorial changes.'
  },
  {
    number: 2,
    title: 'Salaries and Allowances',
    relatedArticles: 'Articles 59, 65, 75, 97, 125, 148, 158, 164, 186 and 221',
    description: 'Prescribes salaries, allowances, and emoluments of constitutional authorities.'
  },
  {
    number: 3,
    title: 'Forms of Oaths and Affirmations',
    relatedArticles: 'Articles 75, 84, 99, 124, 146, 173, 188 and 219',
    description: 'Contains constitutional oath formats for office-holders and judges.'
  },
  {
    number: 4,
    title: 'Allocation of Seats in the Council of States',
    relatedArticles: 'Articles 4 and 80',
    description: 'Specifies the allocation of Rajya Sabha seats among States and Union Territories.'
  },
  {
    number: 5,
    title: 'Administration of Scheduled Areas and Scheduled Tribes',
    relatedArticles: 'Article 244',
    description: 'Provides for administration and control of Scheduled Areas and Scheduled Tribes.'
  },
  {
    number: 6,
    title: 'Administration of Tribal Areas in the North-East',
    relatedArticles: 'Articles 244 and 275',
    description: 'Covers administration of tribal areas in Assam, Meghalaya, Tripura, and Mizoram.'
  },
  {
    number: 7,
    title: 'Union List, State List and Concurrent List',
    relatedArticles: 'Article 246',
    description: 'Distributes legislative subjects between the Union and the States.'
  },
  {
    number: 8,
    title: 'Languages',
    relatedArticles: 'Articles 344 and 351',
    description: 'Lists recognised languages in the Eighth Schedule.'
  },
  {
    number: 9,
    title: 'Validation of Certain Acts and Regulations',
    relatedArticles: 'Article 31B',
    description: 'Protects specified laws from challenge on the ground of violation of Fundamental Rights.'
  },
  {
    number: 10,
    title: 'Anti-Defection Provisions',
    relatedArticles: 'Articles 102 and 191',
    description: 'Contains provisions for disqualification on the ground of defection.'
  },
  {
    number: 11,
    title: 'Panchayats',
    relatedArticles: 'Article 243G',
    description: 'Lists functional subjects that may be devolved to Panchayats.'
  },
  {
    number: 12,
    title: 'Municipalities',
    relatedArticles: 'Article 243W',
    description: 'Lists functional subjects that may be devolved to Municipalities.'
  }
];
