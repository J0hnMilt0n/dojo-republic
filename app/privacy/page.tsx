"use client";

import { useState } from "react";
import { Shield, Copy, Printer } from "lucide-react";

export default function PrivacyPolicyPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      document.getElementById("privacy-content")?.innerText || "",
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative bg-linear-to-br from-[#0A0F2B] via-[#1F2A5C] to-[#0D1B3E] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-8 h-8 text-red-500" />
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Privacy Policy
                </h1>
              </div>
              <p className="text-base text-gray-300 font-light">
                Last updated: <span id="last-updated">April 03, 2026</span>
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 text-sm"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-300 text-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16" id="privacy-content">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg prose-slate max-w-none">
            {/* Introduction */}
            <div className="mb-12">
              <p className="text-gray-700 leading-relaxed mb-4">
                This Privacy Notice for <strong>Dojo Republic</strong> ('we',
                'us', or 'our'), describes how and why we might access, collect,
                store, use, and/or share ('process') your personal information
                when you use our services ('Services'), including when you:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4 space-y-2 ml-4">
                <li>
                  Visit our website at{" "}
                  <strong>https://www.dojorepublic.com/dashboard</strong> or any
                  website of ours that links to this Privacy Notice
                </li>
                <li>
                  Download and use our mobile application (Dojo Republic), or
                  any other application of ours that links to this Privacy
                  Notice
                </li>
                <li>
                  Use Dojo Republic. Dojo Republic is a digital platform
                  designed for fighters, martial artists, and combat sports
                  enthusiasts. The platform enables users to create profiles,
                  showcase their skills, track progress, and connect with other
                  fighters, coaches, and organizations. We provide tools for
                  performance tracking, content sharing, community engagement,
                  and career development across various combat sports
                  disciplines. Dojo Republic aims to build a unified ecosystem
                  where fighters can grow, network, and gain visibility.
                </li>
                <li>
                  Engage with us in other related ways, including any marketing
                  or events
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Questions or concerns?</strong> Reading this Privacy
                Notice will help you understand your privacy rights and choices.
                We are responsible for making decisions about how your personal
                information is processed. If you do not agree with our policies
                and practices, please do not use our Services. If you still have
                any questions or concerns, please contact us at{" "}
                <strong>dojorepublic.official@gmail.com</strong>.
              </p>
            </div>

            {/* Summary of Key Points */}
            <div className="mb-12 bg-[#FEFEFE] p-6 rounded-xl border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                SUMMARY OF KEY POINTS
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                This summary provides key points from our Privacy Notice, but
                you can find out more details about any of these topics by
                clicking the link following each key point or by using our table
                of contents below to find the section you are looking for.
              </p>
              <ul className="text-gray-700 leading-relaxed space-y-3">
                <li>
                  <strong>What personal information do we process?</strong> When
                  you visit, use, or navigate our Services, we may process
                  personal information depending on how you interact with us and
                  the Services, the choices you make, and the products and
                  features you use.{" "}
                  <a
                    href="#information-collected"
                    className="text-red-600 hover:underline"
                  >
                    Learn more about personal information you disclose to us.
                  </a>
                </li>
                <li>
                  <strong>
                    Do we process any sensitive personal information?
                  </strong>{" "}
                  Some of the information may be considered 'special' or
                  'sensitive' in certain jurisdictions, for example your racial
                  or ethnic origins, sexual orientation, and religious beliefs.
                  We may process sensitive personal information when necessary
                  with your consent or as otherwise permitted by applicable law.{" "}
                  <a
                    href="#sensitive-information"
                    className="text-red-600 hover:underline"
                  >
                    Learn more about sensitive information we process.
                  </a>
                </li>
                <li>
                  <strong>
                    Do we collect any information from third parties?
                  </strong>{" "}
                  We do not collect any information from third parties.
                </li>
                <li>
                  <strong>How do we process your information?</strong> We
                  process your information to provide, improve, and administer
                  our Services, communicate with you, for security and fraud
                  prevention, and to comply with law. We may also process your
                  information for other purposes with your consent. We process
                  your information only when we have a valid legal reason to do
                  so.{" "}
                  <a
                    href="#how-we-process"
                    className="text-red-600 hover:underline"
                  >
                    Learn more about how we process your information.
                  </a>
                </li>
                <li>
                  <strong>
                    In what situations and with which parties do we share
                    personal information?
                  </strong>{" "}
                  We may share information in specific situations and with
                  specific third parties.{" "}
                  <a
                    href="#when-we-share"
                    className="text-red-600 hover:underline"
                  >
                    Learn more about when and with whom we share your personal
                    information.
                  </a>
                </li>
                <li>
                  <strong>How do we keep your information safe?</strong> We have
                  adequate organisational and technical processes and procedures
                  in place to protect your personal information. However, no
                  electronic transmission over the internet or information
                  storage technology can be guaranteed to be 100% secure, so we
                  cannot promise or guarantee that hackers, cybercriminals, or
                  other unauthorised third parties will not be able to defeat
                  our security and improperly collect, access, steal, or modify
                  your information.{" "}
                  <a href="#security" className="text-red-600 hover:underline">
                    Learn more about how we keep your information safe.
                  </a>
                </li>
                <li>
                  <strong>What are your rights?</strong> Depending on where you
                  are located geographically, the applicable privacy law may
                  mean you have certain rights regarding your personal
                  information.{" "}
                  <a
                    href="#your-rights"
                    className="text-red-600 hover:underline"
                  >
                    Learn more about your privacy rights.
                  </a>
                </li>
                <li>
                  <strong>How do you exercise your rights?</strong> The easiest
                  way to exercise your rights is by submitting a data subject
                  access request, or by contacting us. We will consider and act
                  upon any request in accordance with applicable data protection
                  laws.
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4 font-semibold">
                Want to learn more about what we do with any information we
                collect? Review the Privacy Notice in full.
              </p>
            </div>

            {/* Table of Contents */}
            <div className="mb-12 bg-[#FEFEFE] p-6 rounded-xl border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                TABLE OF CONTENTS
              </h2>
              <ol className="space-y-2 text-gray-700">
                <li>
                  <a
                    href="#information-collected"
                    className="hover:text-red-600 transition"
                  >
                    WHAT INFORMATION DO WE COLLECT?
                  </a>
                </li>
                <li>
                  <a
                    href="#how-we-process"
                    className="hover:text-red-600 transition"
                  >
                    HOW DO WE PROCESS YOUR INFORMATION?
                  </a>
                </li>
                <li>
                  <a
                    href="#legal-bases"
                    className="hover:text-red-600 transition"
                  >
                    WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL
                    INFORMATION?
                  </a>
                </li>
                <li>
                  <a
                    href="#when-we-share"
                    className="hover:text-red-600 transition"
                  >
                    WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
                  </a>
                </li>
                <li>
                  <a
                    href="#third-party-websites"
                    className="hover:text-red-600 transition"
                  >
                    WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?
                  </a>
                </li>
                <li>
                  <a href="#cookies" className="hover:text-red-600 transition">
                    DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
                  </a>
                </li>
                <li>
                  <a
                    href="#ai-products"
                    className="hover:text-red-600 transition"
                  >
                    DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?
                  </a>
                </li>
                <li>
                  <a
                    href="#social-logins"
                    className="hover:text-red-600 transition"
                  >
                    HOW DO WE HANDLE YOUR SOCIAL LOGINS?
                  </a>
                </li>
                <li>
                  <a
                    href="#data-retention"
                    className="hover:text-red-600 transition"
                  >
                    HOW LONG DO WE KEEP YOUR INFORMATION?
                  </a>
                </li>
                <li>
                  <a href="#security" className="hover:text-red-600 transition">
                    HOW DO WE KEEP YOUR INFORMATION SAFE?
                  </a>
                </li>
                <li>
                  <a
                    href="#your-rights"
                    className="hover:text-red-600 transition"
                  >
                    WHAT ARE YOUR PRIVACY RIGHTS?
                  </a>
                </li>
                <li>
                  <a
                    href="#do-not-track"
                    className="hover:text-red-600 transition"
                  >
                    CONTROLS FOR DO-NOT-TRACK FEATURES
                  </a>
                </li>
                <li>
                  <a
                    href="#us-rights"
                    className="hover:text-red-600 transition"
                  >
                    DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
                  </a>
                </li>
                <li>
                  <a
                    href="#other-regions"
                    className="hover:text-red-600 transition"
                  >
                    DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?
                  </a>
                </li>
                <li>
                  <a href="#updates" className="hover:text-red-600 transition">
                    DO WE MAKE UPDATES TO THIS NOTICE?
                  </a>
                </li>
                <li>
                  <a
                    href="#contact-us"
                    className="hover:text-red-600 transition"
                  >
                    HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
                  </a>
                </li>
                <li>
                  <a
                    href="#review-update-delete"
                    className="hover:text-red-600 transition"
                  >
                    HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT
                    FROM YOU?
                  </a>
                </li>
              </ol>
            </div>

            {/* 1. WHAT INFORMATION DO WE COLLECT? */}
            <div id="information-collected" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                1. WHAT INFORMATION DO WE COLLECT?
              </h2>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Personal information you disclose to us
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 italic">
                In Short: We collect personal information that you provide to
                us.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect personal information that you voluntarily provide to
                us when you register on the Services, express an interest in
                obtaining information about us or our products and Services,
                when you participate in activities on the Services, or otherwise
                when you contact us.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Personal Information Provided by You.</strong> The
                personal information that we collect depends on the context of
                your interactions with us and the Services, the choices you
                make, and the products and features you use. The personal
                information we collect may include the following:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4 space-y-2 ml-4">
                <li>names</li>
                <li>phone numbers</li>
                <li>email addresses</li>
                <li>mailing addresses</li>
                <li>usernames</li>
                <li>passwords</li>
                <li>contact preferences</li>
                <li>contact or authentication data</li>
                <li>billing addresses</li>
                <li>debit/credit card numbers</li>
                <li>job titles</li>
              </ul>

              <h3
                id="sensitive-information"
                className="text-xl font-bold text-gray-900 mb-4"
              >
                Sensitive Information
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                When necessary, with your consent or as otherwise permitted by
                applicable law, we process the following categories of sensitive
                information:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4 space-y-2 ml-4">
                <li>student data</li>
                <li>health data</li>
                <li>genetic data</li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Social Media Login Data
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may provide you with the option to register with us using
                your existing social media account details, like your Facebook,
                X, or other social media account. If you choose to register in
                this way, we will collect certain profile information about you
                from the social media provider, as described in the section
                called 'HOW DO WE HANDLE YOUR SOCIAL LOGINS?' below.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Application Data
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you use our application(s), we also may collect the following
                information if you choose to provide us with access or
                permission:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4 space-y-2 ml-4">
                <li>
                  <strong>Geolocation Information.</strong> We may request
                  access or permission to track location-based information from
                  your mobile device, either continuously or while you are using
                  our mobile application(s), to provide certain location-based
                  services. If you wish to change our access or permissions, you
                  may do so in your device's settings.
                </li>
                <li>
                  <strong>Mobile Device Access.</strong> We may request access
                  or permission to certain features from your mobile device,
                  including your mobile device's calendar, camera, microphone,
                  reminders, sensors, sms messages, social media accounts,
                  storage, and other features. If you wish to change our access
                  or permissions, you may do so in your device's settings.
                </li>
                <li>
                  <strong>Push Notifications.</strong> We may request to send
                  you push notifications regarding your account or certain
                  features of the application(s). If you wish to opt out from
                  receiving these types of communications, you may turn them off
                  in your device's settings.
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                This information is primarily needed to maintain the security
                and operation of our application(s), for troubleshooting, and
                for our internal analytics and reporting purposes.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                All personal information that you provide to us must be true,
                complete, and accurate, and you must notify us of any changes to
                such personal information.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Information automatically collected
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 italic">
                In Short: Some information — such as your Internet Protocol (IP)
                address and/or browser and device characteristics — is collected
                automatically when you visit our Services.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                We automatically collect certain information when you visit,
                use, or navigate the Services. This information does not reveal
                your specific identity (like your name or contact information)
                but may include device and usage information, such as your IP
                address, browser and device characteristics, operating system,
                language preferences, referring URLs, device name, country,
                location, information about how and when you use our Services,
                and other technical information. This information is primarily
                needed to maintain the security and operation of our Services,
                and for our internal analytics and reporting purposes.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Like many businesses, we also collect information through
                cookies and similar technologies. You can find out more about
                this in our Cookie Notice:{" "}
                <a
                  href="https://www.dojorepublic.com/privacy"
                  className="text-red-600 hover:underline"
                >
                  https://www.dojorepublic.com/privacy
                </a>
                .
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The information we collect includes:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4 space-y-2 ml-4">
                <li>
                  <strong>Log and Usage Data.</strong> Log and usage data is
                  service-related, diagnostic, usage, and performance
                  information our servers automatically collect when you access
                  or use our Services and which we record in log files.
                  Depending on how you interact with us, this log data may
                  include your IP address, device information, browser type, and
                  settings and information about your activity in the Services
                  (such as the date/time stamps associated with your usage,
                  pages and files viewed, searches, and other actions you take
                  such as which features you use), device event information
                  (such as system activity, error reports (sometimes called
                  'crash dumps'), and hardware settings).
                </li>
                <li>
                  <strong>Device Data.</strong> We collect device data such as
                  information about your computer, phone, tablet, or other
                  device you use to access the Services. Depending on the device
                  used, this device data may include information such as your IP
                  address (or proxy server), device and application
                  identification numbers, location, browser type, hardware
                  model, Internet service provider and/or mobile carrier,
                  operating system, and system configuration information.
                </li>
                <li>
                  <strong>Location Data.</strong> We collect location data such
                  as information about your device's location, which can be
                  either precise or imprecise. How much information we collect
                  depends on the type and settings of the device you use to
                  access the Services. For example, we may use GPS and other
                  technologies to collect geolocation data that tells us your
                  current location (based on your IP address). You can opt out
                  of allowing us to collect this information either by refusing
                  access to the information or by disabling your Location
                  setting on your device. However, if you choose to opt out, you
                  may not be able to use certain aspects of the Services.
                </li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Google API
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Our use of information received from Google APIs will adhere to
                Google API Services User Data Policy, including the Limited Use
                requirements.
              </p>
            </div>

            {/* 2. HOW DO WE PROCESS YOUR INFORMATION? */}
            <div id="how-we-process" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                2. HOW DO WE PROCESS YOUR INFORMATION?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 italic">
                In Short: We process your information to provide, improve, and
                administer our Services, communicate with you, for security and
                fraud prevention, and to comply with law. We process the
                personal information for the following purposes listed below. We
                may also process your information for other purposes only with
                your prior explicit consent.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                We process your personal information for a variety of reasons,
                depending on how you interact with our Services, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-3 ml-4">
                <li>
                  <strong>
                    To facilitate account creation and authentication and
                    otherwise manage user accounts.
                  </strong>{" "}
                  We may process your information so you can create and log in
                  to your account, as well as keep your account in working
                  order.
                </li>
                <li>
                  <strong>To request feedback.</strong> We may process your
                  information when necessary to request feedback and to contact
                  you about your use of our Services.
                </li>
                <li>
                  <strong>
                    To send you marketing and promotional communications.
                  </strong>{" "}
                  We may process the personal information you send to us for our
                  marketing purposes, if this is in accordance with your
                  marketing preferences. You can opt out of our marketing emails
                  at any time. For more information, see 'WHAT ARE YOUR PRIVACY
                  RIGHTS?' below.
                </li>
                <li>
                  <strong>To deliver targeted advertising to you.</strong> We
                  may process your information to develop and display
                  personalised content and advertising tailored to your
                  interests, location, and more. For more information see our
                  Cookie Notice:{" "}
                  <a
                    href="https://www.dojorepublic.com/privacy"
                    className="text-red-600 hover:underline"
                  >
                    https://www.dojorepublic.com/privacy
                  </a>
                  .
                </li>
                <li>
                  <strong>To protect our Services.</strong> We may process your
                  information as part of our efforts to keep our Services safe
                  and secure, including fraud monitoring and prevention.
                </li>
                <li>
                  <strong>To identify usage trends.</strong> We may process
                  information about how you use our Services to better
                  understand how they are being used so we can improve them.
                </li>
                <li>
                  <strong>
                    To determine the effectiveness of our marketing and
                    promotional campaigns.
                  </strong>{" "}
                  We may process your information to better understand how to
                  provide marketing and promotional campaigns that are most
                  relevant to you.
                </li>
                <li>
                  <strong>
                    To save or protect an individual's vital interest.
                  </strong>{" "}
                  We may process your information when necessary to save or
                  protect an individual's vital interest, such as to prevent
                  harm.
                </li>
              </ul>
            </div>

            {/* 3. WHAT LEGAL BASES DO WE RELY ON? */}
            <div id="legal-bases" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 italic">
                In Short: We only process your personal information when we
                believe it is necessary and we have a valid legal reason (i.e.
                legal basis) to do so under applicable law, like with your
                consent, to comply with laws, to provide you with services to
                enter into or fulfil our contractual obligations, to protect
                your rights, or to fulfil our legitimate business interests.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                If you are located in the EU or UK, this section applies to you.
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The General Data Protection Regulation (GDPR) and UK GDPR
                require us to explain the valid legal bases we rely on in order
                to process your personal information. As such, we may rely on
                the following legal bases to process your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4 space-y-2 ml-4">
                <li>
                  <strong>Consent.</strong> We may process your information if
                  you have given us permission (i.e. consent) to use your
                  personal information for a specific purpose. You can withdraw
                  your consent at any time.{" "}
                  <a
                    href="#your-rights"
                    className="text-red-600 hover:underline"
                  >
                    Learn more about withdrawing your consent.
                  </a>
                </li>
                <li>
                  <strong>Legitimate Interests.</strong> We may process your
                  information when we believe it is reasonably necessary to
                  achieve our legitimate business interests and those interests
                  do not outweigh your interests and fundamental rights and
                  freedoms. For example, we may process your personal
                  information for some of the purposes described in order to:
                  <ul className="list-circle list-inside text-gray-700 leading-relaxed mb-2 space-y-1 ml-6 mt-2">
                    <li>
                      Send users information about special offers and discounts
                      on our products and services
                    </li>
                    <li>
                      Develop and display personalised and relevant advertising
                      content for our users
                    </li>
                    <li>
                      Analyse how our Services are used so we can improve them
                      to engage and retain users
                    </li>
                    <li>Support our marketing activities</li>
                    <li>
                      Diagnose problems and/or prevent fraudulent activities
                    </li>
                    <li>
                      Understand how our users use our products and services so
                      we can improve user experience
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Legal Obligations.</strong> We may process your
                  information where we believe it is necessary for compliance
                  with our legal obligations, such as to cooperate with a law
                  enforcement body or regulatory agency, exercise or defend our
                  legal rights, or disclose your information as evidence in
                  litigation in which we are involved.
                </li>
                <li>
                  <strong>Vital Interests.</strong> We may process your
                  information where we believe it is necessary to protect your
                  vital interests or the vital interests of a third party, such
                  as situations involving potential threats to the safety of any
                  person.
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                In legal terms, we are generally the 'data controller' under
                European data protection laws of the personal information
                described in this Privacy Notice, since we determine the means
                and/or purposes of the data processing we perform. This Privacy
                Notice does not apply to the personal information we process as
                a 'data processor' on behalf of our customers. In those
                situations, the customer that we provide services to and with
                whom we have entered into a data processing agreement is the
                'data controller' responsible for your personal information, and
                we merely process your information on their behalf in accordance
                with your instructions. If you want to know more about our
                customers' privacy practices, you should read their privacy
                policies and direct any questions you have to them.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                If you are located in Canada, this section applies to you.
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may process your information if you have given us specific
                permission (i.e. express consent) to use your personal
                information for a specific purpose, or in situations where your
                permission can be inferred (i.e. implied consent). You can
                withdraw your consent at any time.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                In some exceptional cases, we may be legally permitted under
                applicable law to process your information without your consent,
                including, for example:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-4">
                <li>
                  If collection is clearly in the interests of an individual and
                  consent cannot be obtained in a timely way
                </li>
                <li>For investigations and fraud detection and prevention</li>
                <li>
                  For business transactions provided certain conditions are met
                </li>
                <li>
                  If it is contained in a witness statement and the collection
                  is necessary to assess, process, or settle an insurance claim
                </li>
                <li>
                  For identifying injured, ill, or deceased persons and
                  communicating with next of kin
                </li>
                <li>
                  If we have reasonable grounds to believe an individual has
                  been, is, or may be victim of financial abuse
                </li>
                <li>
                  If it is reasonable to expect collection and use with consent
                  would compromise the availability or the accuracy of the
                  information and the collection is reasonable for purposes
                  related to investigating a breach of an agreement or a
                  contravention of the laws of Canada or a province
                </li>
                <li>
                  If disclosure is required to comply with a subpoena, warrant,
                  court order, or rules of the court relating to the production
                  of records
                </li>
                <li>
                  If it was produced by an individual in the course of their
                  employment, business, or profession and the collection is
                  consistent with the purposes for which the information was
                  produced
                </li>
                <li>
                  If the collection is solely for journalistic, artistic, or
                  literary purposes
                </li>
                <li>
                  If the information is publicly available and is specified by
                  the regulations
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                We may disclose de-identified information for approved research
                or statistics projects, subject to ethics oversight and
                confidentiality commitments.
              </p>
            </div>

            {/* 4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION? */}
            <div id="when-we-share" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 italic">
                In Short: We may share information in specific situations
                described in this section and/or with the following third
                parties.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may need to share your personal information in the following
                situations:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-4">
                <li>
                  <strong>Business Transfers.</strong> We may share or transfer
                  your information in connection with, or during negotiations
                  of, any merger, sale of company assets, financing, or
                  acquisition of all or a portion of our business to another
                  company.
                </li>
              </ul>
            </div>

            {/* 5. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES? */}
            <div id="third-party-websites" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                5. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 italic">
                In Short: We are not responsible for the safety of any
                information that you share with third parties that we may link
                to or who advertise on our Services, but are not affiliated
                with, our Services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The Services may link to third-party websites, online services,
                or mobile applications and/or contain advertisements from third
                parties that are not affiliated with us and which may link to
                other websites, services, or applications. Accordingly, we do
                not make any guarantee regarding any such third parties, and we
                will not be liable for any loss or damage caused by the use of
                such third-party websites, services, or applications. The
                inclusion of a link towards a third-party website, service, or
                application does not imply an endorsement by us. We cannot
                guarantee the safety and privacy of data you provide to any
                third-party websites. Any data collected by third parties is not
                covered by this Privacy Notice. We are not responsible for the
                content or privacy and security practices and policies of any
                third parties, including other websites, services, or
                applications.
              </p>
            </div>

            {/* 6. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES? */}
            <div id="cookies" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                6. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may use cookies and similar tracking technologies (like web
                beacons and pixels) to access or store information. Specific
                information about how we use such technologies and how you can
                refuse certain cookies is set out in our Cookie Notice:{" "}
                <a
                  href="https://www.dojorepublic.com/privacy"
                  className="text-red-600 hover:underline"
                >
                  https://www.dojorepublic.com/privacy
                </a>
                .
              </p>
            </div>

            {/* 7. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS? */}
            <div id="ai-products" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                7. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may use artificial intelligence and machine learning
                technologies as part of our services, including for performance
                analysis, content recommendations, and platform improvements.
                Any AI-based processing is conducted in accordance with this
                Privacy Notice and applicable data protection laws.
              </p>
            </div>

            {/* 8. HOW DO WE HANDLE YOUR SOCIAL LOGINS? */}
            <div id="social-logins" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                8. HOW DO WE HANDLE YOUR SOCIAL LOGINS?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may provide you with the option to register using social
                media account details, like your Facebook, X, or other social
                media account. If you choose to register in this way, we will
                collect certain profile information about you from the social
                media provider, as described in Section 1.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The social media provider will give us access to certain
                information we have about your profile in accordance with your
                settings. This typically includes your name, email address,
                profile picture, and other information you choose to make public
                or that is necessary for the functionality of the social login.
              </p>
            </div>

            {/* 9. HOW LONG DO WE KEEP YOUR INFORMATION? */}
            <div id="data-retention" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                9. HOW LONG DO WE KEEP YOUR INFORMATION?
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We will only keep your personal information for as long as it is
                necessary for the purposes set out in this Privacy Notice,
                unless a longer retention period is required or permitted by law
                (such as tax, accounting or other legal requirements). No
                purpose in this Notice will require us keeping your personal
                information for longer than the period necessary to fulfil the
                purposes for which we collected it.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                When we have no ongoing legitimate business need to process your
                personal information, we will either delete or anonymise such
                information, or, if this is not possible (for example, because
                your personal information has been stored in backup archives),
                then we will securely store your personal information and
                isolate it from any further processing until deletion is
                possible.
              </p>
            </div>

            {/* 10. HOW DO WE KEEP YOUR INFORMATION SAFE? */}
            <div id="security" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                10. HOW DO WE KEEP YOUR INFORMATION SAFE?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We have implemented appropriate and reasonable technical and
                organisational security measures designed to protect the
                security of any personal information we process. However,
                despite our safeguards and efforts to secure your information,
                no electronic transmission over the Internet or information
                storage technology can be guaranteed to be 100% secure, so we
                cannot promise or guarantee that hackers, cybercriminals, or
                other unauthorised third parties will not be able to defeat our
                security and improperly collect, access, steal, or modify your
                information.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Although we will do our best to protect your personal
                information, transmission of personal information to and from
                our Services is at your own risk. You should only access the
                Services within a secure environment.
              </p>
            </div>

            {/* 11. WHAT ARE YOUR PRIVACY RIGHTS? */}
            <div id="your-rights" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                11. WHAT ARE YOUR PRIVACY RIGHTS?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Depending on your location, you may have some or all of the
                following rights under applicable data protection laws:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-4">
                <li>
                  <strong>Right to Access.</strong> You have the right to
                  request copies of your personal information and information
                  about how we process it.
                </li>
                <li>
                  <strong>Right to Rectification.</strong> You have the right to
                  request correction of inaccurate or incomplete personal
                  information.
                </li>
                <li>
                  <strong>Right to Erasure.</strong> You have the right to
                  request deletion of your personal information under certain
                  circumstances.
                </li>
                <li>
                  <strong>Right to Restrict Processing.</strong> You have the
                  right to request restriction of processing your personal
                  information under certain circumstances.
                </li>
                <li>
                  <strong>Right to Data Portability.</strong> You have the right
                  to request transfer of your personal information to another
                  party under certain circumstances.
                </li>
                <li>
                  <strong>Right to Object.</strong> You have the right to object
                  to processing of your personal information under certain
                  circumstances.
                </li>
                <li>
                  <strong>Right to Withdraw Consent.</strong> If we are
                  processing your personal information based on your consent,
                  you have the right to withdraw your consent at any time.
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                To exercise these rights, please contact us using the contact
                details provided below. We will respond to your request within a
                reasonable timeframe and in accordance with applicable data
                protection laws.
              </p>
            </div>

            {/* 12. CONTROLS FOR DO-NOT-TRACK FEATURES */}
            <div id="do-not-track" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                12. CONTROLS FOR DO-NOT-TRACK FEATURES
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Most web browsers and some mobile operating systems and mobile
                applications include a Do-Not-Track ('DNT') feature or setting
                you can activate to signal your privacy preference not to have
                data about your online browsing activities monitored and
                collected. No uniform technology standard for recognizing and
                implementing DNT signals has been finalized. As such, we do not
                currently respond to DNT browser signals or any other mechanism
                that automatically communicates your choice not to be tracked
                online. If a standard for online tracking is adopted that we
                must follow in the future, we will inform you about that
                practice in a revised version of this Privacy Notice.
              </p>
            </div>

            {/* 13. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS? */}
            <div id="us-rights" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                13. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you are a resident of certain US states, you may have
                additional rights under state privacy laws. These may include:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-4">
                <li>
                  The right to know what personal information we collect, use,
                  disclose, and sell
                </li>
                <li>The right to access your personal information</li>
                <li>The right to delete your personal information</li>
                <li>
                  The right to opt-out of the sale of your personal information
                </li>
                <li>
                  The right to non-discrimination for exercising your privacy
                  rights
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                We do not sell your personal information. If you wish to
                exercise any of these rights, please contact us using the
                information below.
              </p>
            </div>

            {/* 14. DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS? */}
            <div id="other-regions" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                14. DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If you are located in a region not specifically mentioned above,
                you may still have privacy rights under local laws. Please
                contact us if you have questions about your rights in your
                jurisdiction.
              </p>
            </div>

            {/* 15. DO WE MAKE UPDATES TO THIS NOTICE? */}
            <div id="updates" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                15. DO WE MAKE UPDATES TO THIS NOTICE?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this Privacy Notice from time to time. The updated
                version will be indicated by an updated 'Last updated' date and
                the updated version will be effective as soon as it is
                accessible. If we make material changes to this Privacy Notice,
                we may notify you either by prominently posting a notice of such
                changes or by directly sending you a notification. We encourage
                you to periodically review this Privacy Notice to be informed of
                how we are protecting your information.
              </p>
            </div>

            {/* 16. HOW CAN YOU CONTACT US ABOUT THIS NOTICE? */}
            <div id="contact-us" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                16. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions or comments about this Notice, you may
                email us at <strong>dojorepublic.official@gmail.com</strong> or
                contact us by post at:
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Dojo Republic</strong>
                <br />
                London, United Kingdom
              </p>
            </div>

            {/* 17. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU? */}
            <div id="review-update-delete" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                17. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT
                FROM YOU?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have the right to request access to the personal information
                we collect from you, change it, or in some cases, delete it. To
                exercise these rights, please submit a data subject access
                request by contacting us at{" "}
                <strong>dojorepublic.official@gmail.com</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We will respond to your request within 30 days. If we need more
                time, we will inform you of the extension and the reason. We may
                need to verify your identity before processing your request.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
