import DmlMarketplace from '../solidity/build/contracts/DmlMarketplace.json';
import DmlBountyFactory from '../solidity/build/contracts/DmlBountyFactory.json';
import FixedSupplyToken from '../solidity/build/contracts/FixedSupplyToken.json';
import Bounty from '../solidity/build/contracts/Bounty.json';
import Algo from '../solidity/build/contracts/Algo.json';

// Ropsten0x5eA73f388F6FD7D37701e3832194B05bB15ae5c4
// export const TOKEN_CONTRACT_ADDRESS = '';

// Rinkeby
// export const TOKEN_CONTRACT_ADDRESS = '0x3195fd025302c62907886b1743405e14a89514b6';
// export const MARKETPLACE_CONTRACT_ADDRESS = '0x72b7440ca56b5f8841e881d92781ec3f389b60c6';
// export const BOUNTY_FACTORY_ADDRESS = '0xaafd5d14e05A7C1030B13B2879458c1F86eDEe0C';

// Main Net
// 0xbCdfE338D55c061C084D81fD793Ded00A27F226D
// export const TOKEN_CONTRACT_ADDRESS = '0xbCdfE338D55c061C084D81fD793Ded00A27F226D';
// export const MARKETPLACE_CONTRACT_ADDRESS = '0x3ec80b91a87b08633bd2d40da71d4b6744807abe';
// export const BOUNTY_FACTORY_ADDRESS = '0xf90126f0f65839c5820aabc90b2fc18285196383';

// New Main Net
export const TOKEN_CONTRACT_ADDRESS = '0xbCdfE338D55c061C084D81fD793Ded00A27F226D';
export const MARKETPLACE_CONTRACT_ADDRESS = '0x8ed59FDBFDC14dBD87d1d74a6cBBdF16C3D787E5';
export const BOUNTY_FACTORY_ADDRESS = '0x1d34133a2C5A3B426C9Ccde60f04B046265E183E';

export const TOKEN_CONTRACT_ABI = FixedSupplyToken.abi;
export const MARKETPLACE_CONTRACT_ABI = DmlMarketplace.abi;
export const BOUNTY_FACTORY_ABI = DmlBountyFactory.abi;
export const BOUNTY_ABI = Bounty.abi;
export const ALGO_ABI = Algo.abi;

export const BOUNTY_STATUS = {
  Initialized: 0,
  EnrollmentStart: 1,
  EnrollmentEnd: 2,
  BountyStart: 3,
  BountyEnd: 4,
  EvaluationEnd: 5,
  Completed: 6,
  Paused: 7,
};

export const DEV_TOC = `
**DML Infrastructure Algorithm Distribution Agreement**

1. Definitions

Authorized Provider: An entity authorized to receive a distribution fee for Products that are sold to users of Devices.

Brand Features: The trade names, trademarks, service marks, logos, domain names, and other distinctive brand features of each party, respectively, as owned (or licensed) by such party from time to time.

Developer or You: Any person or company who provides Products for distribution through DML Infrastructure in accordance with the terms of this Agreement.

Developer Account: A publishing account issued to a Developer in connection with the distribution of Developer Products via DML Infrastructure.

Device: Any device that can access DML Infrastructure.

DML: Decentralized Machine Learning Pte. Ltd. 

DML Infrastructure: The software and services, including the DML Marketplace.

Intellectual Property Rights: All patent rights, copyrights, trademark rights, rights in trade secrets, database rights, moral rights, and any other intellectual property rights (registered or unregistered) throughout the world.

DML Marketplace: The DML Marketplace and other online tools or services provided by DML at https://decentralizedml.com/, as may be updated from time to time.

Products: Software, content, digital materials, and other items and services as made available by Developers via the DML Marketplace.

Tax: Any Federal, state, or local sales, use, value added, goods and services, or other similar transaction taxes. This term excludes telecommunication taxes and similar tax types, property taxes, and taxes based on Your income, including income, franchise, business and occupation, and other similar tax types.

2. Accepting this Agreement

2.1 This agreement ("Agreement") forms a legally binding contract between You and DML in relation to Your use of DML Infrastructure to distribute Products. You are contracting with the applicable DML entity based on where You have selected to distribute Your Product (as set forth here). You acknowledge that DML will, solely at Your direction, display and make Your Products available for viewing, download, and purchase by users. In order to use DML Infrastructure to distribute Products, You accept this Agreement and will provide and maintain complete and accurate information in the DML Marketplace.

2.2 DML will not permit the distribution of Your Products through DML Infrastructure, and You may not accept the Agreement, unless You are verified as a Developer in good standing.

2.3 If You are agreeing to be bound by this Agreement on behalf of Your employer or other entity, You represent and warrant that You have full legal authority to bind Your employer or such entity to this Agreement. If You do not have the requisite authority, You may not accept the Agreement or use DML Infrastructure on behalf of Your employer or other entity.

3. Use of DML Infrastructure by You

3.1 You are responsible for uploading Your Products to DML Infrastructure, providing required Product information and support to users, and accurately disclosing the permissions necessary for the Product to function on user Devices.

3.2 You are responsible for maintaining the confidentiality of any developer credentials that DML may issue to You or which You may choose Yourself and You are solely responsible for all Products that are developed under Your developer credentials. DML may limit the number of Developer Accounts issued to You or to the company or organization You work for.

3.3 Except for the license rights granted by You in this Agreement, DML agrees that it obtains no right, title, or interest from You (or Your licensors) under this Agreement in or to any of Your Products, including any Intellectual Property Rights in those Products.

3.4 You may not use DML Infrastructure to distribute or make available any Product which has a purpose that facilitates the distribution of software applications and algorithm for use on mobile devices outside of DML Infrastructure.

3.5 You agree to use DML Infrastructure only for purposes that are permitted by this Agreement and any applicable law, regulation, or generally accepted practices or guidelines in the relevant jurisdictions (including any laws regarding the export of data or software to and from the Singapore or other relevant countries).

3.6 Users are instructed to contact You concerning any defects or performance issues in Your Products. As between You and DML, You will be solely responsible, and DML will have no responsibility, to undertake or handle support and maintenance of Your Products and any complaints about Your Products. You agree to supply and maintain valid and accurate contact information that will be displayed in each of Your Products’ detail page and made available to users for customer support and legal purposes. For Your paid Products, You agree to respond to customer support inquiries within 3 business days, and within 24 hours to any support or Product concerns stated to be urgent by DML. Failure to provide adequate information or support for Your Products may result in less prominent Product exposure or removal from DML Infrastructure by DML and may result in low Product ratings, lower sales, and billing disputes by users.

3.7 You agree that if You make Your Products available through DML Infrastructure, You will protect the privacy and legal rights of users. If the users provide You with, or Your Product accesses or uses, usernames, passwords, or other login information or personal information, You agree to make the users aware that the information will be available to Your Product, and You agree to provide legally adequate privacy notice and protection for those users. Further, Your Product may only use that information for the limited purposes for which the user has given You permission to do so. If Your Product stores personal or sensitive information provided by users, You agree to do so securely and only for as long as it is needed. However, if the user has opted into a separate agreement with You that allows You or Your Product to store or use personal or sensitive information directly related to Your Product (not including other products or applications), then the terms of that separate agreement will govern Your use of such information. If the user provides Your Product with DML Account information, Your Product may only use that information to access the user's DML Account when, and for the limited purposes for which, the user has given You permission to do so.

3.8 You will not engage in any activity with DML Infrastructure, including making Your Products available via DML Infrastructure, that interferes with, disrupts, damages, or accesses in an unauthorized manner the devices, servers, networks, or other properties or services of any third party including, but not limited to, DML or any Authorized Provider. You may not use user information obtained via DML Infrastructure to sell or distribute Products outside of DML Infrastructure.

3.9 You are solely responsible for, and DML has no responsibility to You for, Your Products, including use of any DML Infrastructure APIs and for the consequences of Your actions, including any loss or damage which DML may suffer.

3.10 DML Infrastructure allows users to rate and review Products. Only users who download the applicable Product will be able to rate and review it on DML Infrastructure. Product ratings may be used to determine the placement of Products on DML Infrastructure. DML Infrastructure may also assign You a composite score for any of Your Products that has not received user ratings. A composite score will be a representation of the quality of Your Product based on Your history and will be determined at DML's sole discretion. For new Developers without Product history, DML may use or publish performance measurements such as uninstall and/or refund rates to identify or remove Products that are not meeting acceptable standards, as determined by DML. DML reserves the right to display Products to users in a manner that will be determined at DML's sole discretion. Your Products may be subject to user ratings to which You may not agree. You may contact DML if You have any questions or concerns regarding such ratings.

4. License Grants

4.1 You grant to DML a nonexclusive, worldwide, and royalty-free license to: reproduce, perform, display, analyze, and use Your Products in connection with (a) the operation and marketing of DML Infrastructure; (b) the marketing of devices and services that support the use of the Products; (c) making improvements to DML Infrastructure, DML Marketplace; and (d) checking for compliance with this Agreement and the Developer Program Policies.

4.2 You grant to DML a nonexclusive and royalty-free license to distribute Your Products in the manner indicated in the DML Marketplace.

4.3 You grant to the user a nonexclusive, worldwide, and perpetual license to perform, display, and use the Product. The user may include, but is not limited to, a family group and family members whose accounts are joined together for the purpose of creating a family group. Family groups on DML Infrastructure will be subject to reasonable limits designed to prevent abuse of family sharing features. Users in a family group may purchase a single copy of the Product (unless otherwise prohibited, as for in-app and subscription Products) and share it with other family members in their family group. If, in the DML Marketplace, You opt in to allowing users to share previously purchased Products, Your authorization of sharing of those purchases by those users is subject to this Agreement. If You choose, You may include a separate end user license agreement (EULA) in Your Product that will govern the user’s rights to the Product, but, to the extent that EULA conflicts with this Agreement, this Agreement will supersede the EULA.

5. Brand Features and Publicity

5.1 Each party will own all right, title, and interest, including, without limitation, all Intellectual Property Rights, relating to its Brand Features. Except to the limited extent expressly provided in this Agreement, neither party grants, nor will the other party acquire, any right, title, or interest (including, without limitation, any implied license) in or to any Brand Features of the other party.

5.2 Subject to the terms and conditions of this Agreement, Developer grants to DML and its affiliates a limited, nonexclusive, royalty-free license during the term of this Agreement to display Developer Brand Features, submitted by Developer to DML, for use solely online or on mobile devices and in either case solely in connection with the distribution and sale of Developer's Product via DML Infrastructure or to otherwise fulfill its obligations under this Agreement.

5.3 In addition to the license granted in Section 5.2 above, for purposes of marketing the presence, distribution, and sale of Your Product via DML Infrastructure and its availability for use on devices and through other DML services, DML and its affiliates may include visual elements from Your Product (including characters and videos of game play) and Developer Brand Features (a) within DML Infrastructure and in any DML-owned online or mobile properties; (b) in online, mobile, television, out of home (e.g. billboard), and print advertising formats outside DML Infrastructure; (c) when making announcements of the availability of the Product; (d) in presentations; and (e) in customer lists which appear either online or on mobile devices (which includes, without limitation, customer lists posted on DML websites).

5.4 DML grants to Developer a limited, nonexclusive, worldwide, royalty- free license to use the Android Brand Features for the term of this Agreement solely for marketing purposes and only in accordance with the Android Brand Guidelines.

5.5 If Developer discontinues the distribution of specific Products via DML Infrastructure, DML will cease use of the discontinued Products' Brand Features pursuant to this Section 6, except as necessary to allow DML to effectuate reinstalls by users.

6. Promotional Activities

6.1 DML may run promotional activities offering coupons, credits, and/or other promotional incentives for paid transactions and/or user actions for Your Products and in-app transactions solely in connection with DML Infrastructure promotions and, for gift card promotions, also on DML authorized third-party channels ("Promotion(s)"), provided that (a) amounts payable to You will not be impacted; (b) there will be clear communication to users that the Promotion is from DML and not You; (c) the prices You establish will be clearly communicated to users; (d) any redemption of the Promotion will be fulfilled by DML or, for gift card Promotions, through a DML authorized third party; and (e) DML will be responsible for compliance with applicable law for the Promotion.

6.2 In addition to the rights granted in Section 5, You grant DML the right to use Your Brand Features (in the form and manner provided by You) for purposes of marketing Promotions in connection with DML Infrastructure and, for gift card Promotions, on DML authorized third-party channels; provided however, that DML will only use Brand Features owned by You on authorized third- party channels.

7. Product Takedowns

7.1 You may remove Your Products from future distribution via DML Infrastructure at any time, but You agree to comply with this Agreement and the Payment Processor's Payment Account terms of service for any Products distributed via DML Infrastructure prior to removal including, but not limited to, refund requirements. Removing Your Products from future distribution via DML Infrastructure does not (a) affect the license rights of users who have previously purchased or downloaded Your Products; (b) remove Your Products from Devices or from any part of DML Infrastructure where previously purchased or downloaded applications are stored on behalf of users; or (c) change Your obligation to deliver or support Products or services that have been previously purchased or downloaded by users.

7.2 Notwithstanding Section 7.1, in no event will DML maintain on any portion of DML Infrastructure (including, without limitation, the part of DML Infrastructure where previously purchased or downloaded applications are stored on behalf of users) any Product that You have removed from DML Infrastructure and provided written notice to DML that such removal was due to (a) an allegation of infringement, or actual infringement, of any third party Intellectual Property Right; (b) an allegation of, or actual violation of, third party rights; or (c) an allegation or determination that such Product does not comply with applicable law (collectively "Legal Takedowns"). If a Product is removed from DML Infrastructure due to a Legal Takedown and an end user purchased such Product within a year before the date of takedown, at DML's request, You agree to refund to the end user all amounts paid by such end user for such Product.

7.3 DML does not undertake an obligation to monitor the Products or their content. If DML becomes aware and determines in its sole discretion that a Product or any portion thereof (a) violates any applicable law; (b) violates this Agreement, applicable policies, or other terms of service, as may be updated by DML from time to time in its sole discretion; (c) violates terms of distribution agreement with device manufacturers and Authorized Providers; or (d) creates liability for or has an adverse impact on DML or Authorized Providers; then DML may reject, remove, suspend, or reclassify the Product from DML Infrastructure or from Devices. DML reserves the right, at its sole discretion, to suspend and/or bar any Product and/or Developer from DML Infrastructure or from Devices. If Your Product contains elements that could cause serious harm to user devices or data, DML may at its discretion disable the Product or remove it from Devices on which it has been installed. If Your Product is rejected, removed, or suspended from DML Infrastructure or from Devices pursuant to this Section 7.3, then DML may withhold payments due to Developer.

7.4 DML enters into distribution agreements with device manufacturers and Authorized Providers to place the DML Infrastructure software client application(s) on Devices. These distribution agreements may require the involuntary removal of Products in violation of the Device manufacturer's or Authorized Provider's terms of service.

8. Privacy and Information

8.1 Any data collected or used pursuant to this Agreement is in accordance with DML’s Privacy Policy.

8.2 In order to continually innovate and improve DML Infrastructure, related products and services, and the user and Developer experience across DML products and services, DML may collect certain usage statistics from DML Infrastructure and Devices including, but not limited to, information on how the Product, DML Infrastructure, and Devices are being used.

8.3 The data collected is used in the aggregate to improve DML Infrastructure, related products and services, and the user and Developer experience across DML products and services. Developers have access to certain data collected by DML via the DML Marketplace.

9. Terminating this Agreement

9.1 This Agreement will continue to apply until terminated, subject to the terms that survive pursuant to Section 16.9, by either You or DML as set forth below.

9.2 If You want to terminate this Agreement, You will unpublish all of Your Products and cease Your use of the DML Marketplace and any relevant developer credentials.

9.3 DML may terminate this Agreement with You for any reason with thirty (30) days prior written notice. In addition, DML may, at any time, immediately suspend or terminate this Agreement with You if (a) You have breached any provision of this Agreement, any non-disclosure agreement, or other agreement relating to DML Infrastructure or the Android platform; (b) DML is required to do so by law; (c) You cease being an authorized developer, a developer in good standing, or are barred from using Android software; or (d) DML decides to no longer provide DML Infrastructure.

9.4 After termination of this Agreement, DML will not distribute Your Product, but may retain and use copies of the Product for support of DML Infrastructure and the Android platform.

10. Representations and Warranties

10.1 You represent and warrant that You have all Intellectual Property Rights in and to Your Product(s).

10.2 If You use third-party materials, You represent and warrant that You have the right to distribute the third-party material in the Product. You agree that You will not submit material to DML Infrastructure that is subject to third party Intellectual Property Rights unless You are the owner of such rights or have permission from their rightful owner to submit the material.

10.3 You represent and warrant that You and Your Product(s) will comply with all applicable laws.

11. DISCLAIMER OF WARRANTIES

11.1 YOU UNDERSTAND AND EXPRESSLY AGREE THAT YOUR USE OF THE DML Marketplace AND DML Infrastructure IS AT YOUR SOLE RISK AND THAT THE DML Marketplace AND DML Infrastructure ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND.

11.2 YOUR USE OF THE DML Marketplace AND DML Infrastructure AND ANY MATERIAL DOWNLOADED OR OTHERWISE OBTAINED THROUGH THE USE OF THE DML Marketplace AND DML Infrastructure IS AT YOUR OWN DISCRETION AND RISK AND YOU ARE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR COMPUTER SYSTEM OR OTHER DEVICE OR LOSS OF DATA THAT RESULTS FROM SUCH USE.

11.3 DML FURTHER EXPRESSLY DISCLAIMS ALL WARRANTIES AND CONDITIONS OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES AND CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

12. LIMITATION OF LIABILITY

12.1 TO THE MAXIMUM EXTENT PERMITTED BY LAW, YOU UNDERSTAND AND EXPRESSLY AGREE THAT DML, ITS SUBSIDIARIES AND AFFILIATES, AND ITS LICENSORS WILL NOT BE LIABLE TO YOU UNDER ANY THEORY OF LIABILITY FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES THAT MAY BE INCURRED BY YOU, INCLUDING ANY LOSS OF DATA, WHETHER OR NOT DML OR ITS REPRESENTATIVES HAVE BEEN ADVISED OF OR SHOULD HAVE BEEN AWARE OF THE POSSIBILITY OF ANY SUCH LOSSES ARISING.

13. Indemnification

13.1 To the maximum extent permitted by law, You agree to defend, indemnify, and hold harmless DML, its affiliates, and their respective directors, officers, employees and agents, and Authorized Providers from and against any and all third party claims, actions, suits, or proceedings, as well as any and all losses, liabilities, damages, costs, and expenses (including reasonable attorneys’ fees) arising out of or accruing from (a) Your use of the DML Marketplace and DML Infrastructure in violation of this Agreement; (b) infringement or violation by Your Product(s) of any Intellectual Property Right or any other right of any person; or (c) You or Your Product(s)’ violation of any law.

13.2 To the maximum extent permitted by law, You agree to defend, indemnify, and hold harmless the applicable Payment Processors (which may include DML and/or third parties) and the Payment Processors' affiliates, directors, officers, employees, and agents from and against any and all third party claims, actions, suits, or proceedings, as well as any and all losses, liabilities, damages, costs, and expenses (including reasonable attorneys’ fees) arising out of or accruing from Your distribution of Products via DML Infrastructure.

14. Changes to the Agreement.

14.1 DML may make changes to this Agreement at any time with notice to Developer and the opportunity to decline further use of DML Infrastructure. You should look at the Agreement and check for notice of any changes regularly.

14.2 Changes will not be retroactive. They will become effective, and will be deemed accepted by Developer, (a) immediately for those who become Developers after the notification is posted; or (b) for pre-existing Developers, on the date specified in the notice, which will be no sooner than 30 days after the changes are posted (except changes required by law which will be effective immediately).

14.3 If You do not agree with the modifications to the Agreement, You may terminate Your use of DML Infrastructure, which will be Your sole and exclusive remedy. You agree that Your continued use of DML Infrastructure constitutes Your agreement to the modified terms of this Agreement.

15. General Legal Terms

15.1 This Agreement, including any addenda You may have agreed to separately, constitutes the entire legal agreement between You and DML and governs Your use of DML Infrastructure and completely replaces any prior agreements between You and DML in relation to DML Infrastructure. The English language version of this Agreement will control and translations, if any, are non-binding and for reference only.

15.2 You agree that if DML does not exercise or enforce any legal right or remedy contained in this Agreement (or which DML has the benefit of under any applicable law), this will not be taken to be a formal waiver of DML's rights and that those rights or remedies will still be available to DML.

15.3 If any court of law having the jurisdiction to decide on this matter rules that any provision of this Agreement is invalid, then that provision will be removed from this Agreement without affecting the rest of this Agreement. The remaining provisions of this Agreement will continue to be valid and enforceable.

15.4 You acknowledge and agree that each member of the group of companies comprising DML will be third party beneficiaries to this Agreement and that such other companies will be entitled to directly enforce, and rely upon, any provision of this Agreement that confers a benefit on (or rights in favor of) them. Other than this, no other person or company will be third party beneficiaries to this Agreement.

15.5 PRODUCTS ON DML Infrastructure MAY BE SUBJECT TO SINGAPORE AND OTHER JURISDICTIONS EXPORT LAWS AND REGULATIONS. YOU AGREE TO COMPLY WITH ALL DOMESTIC AND INTERNATIONAL EXPORT LAWS AND REGULATIONS THAT APPLY TO YOUR DISTRIBUTION OR USE OF PRODUCTS. THESE LAWS INCLUDE RESTRICTIONS ON DESTINATIONS, USERS, AND END USE.

15.6 Except in the case of a change of control (for example, through a stock purchase or sale, merger, or other form of corporate transaction), the rights granted in this Agreement may not be assigned or transferred by either You or DML without the prior approval of the other party. Any other attempt to assign is void.

15.7 If You experience a change of control, DML may, at its discretion, elect to immediately terminate this Agreement.

15.8 All claims arising out of or relating to this Agreement or Your relationship with DML under this Agreement will be governed by the laws of the Singapore.

15.9 Sections 1 (Definitions), 5.5, 9.4, 10 (Representations and Warranties), 11 (Disclaimer of Warranties), 12 (Limitation of Liability), 13 (Indemnification), and 15 (General Legal Terms) will survive any expiration or termination of this Agreement.

`;
