import React from 'react';

export default function FAQ() {
  return (
    <div className="space-y-6">
      <section className="p-6 rounded-xl" style={{ backgroundColor: '#E0F2EF' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
          Why isn't my organization included?
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          We gather information from publicly available sources and focus our research on specific regions and topics. If your organization is missing, please submit it through the "Suggest a Missing Organization" form. Coverage is expanding as we conduct more field research and as organizations self-report.
        </p>
      </section>

      <section className="p-6 rounded-xl" style={{ backgroundColor: '#F7F0E8' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          Can I request removal from this map?
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Yes, absolutely. If your organization is listed and you prefer not to be included, contact us or use the "Report issue" function and we'll remove your profile promptly. We respect that not all psychedelic work can or should be public.
        </p>
      </section>

      <section className="p-6 rounded-xl" style={{ backgroundColor: '#FFF4E6' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          Why is US and Colorado coverage stronger than other regions?
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Our field research has focused heavily on the United States, particularly Colorado where we've conducted extensive stakeholder interviews. Coverage reflects both our research priorities and the availability of publicly accessible information. We're working to expand geographic coverage as we engage new regions and as international organizations submit their profiles.
        </p>
      </section>

      <section className="p-6 rounded-xl" style={{ backgroundColor: '#E0F2EF' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
          Does being on this map mean PSI endorses my organization?
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          No. Inclusion in this map does not constitute endorsement, validation, quality assessment, or medical advice by PSI. This is a discovery and coordination tool, not a recommendation engine. We're mapping the field to help stakeholders find each other and understand the landscape—not to evaluate or endorse specific organizations.
        </p>
      </section>

      <section className="p-6 rounded-xl" style={{ backgroundColor: '#F7F0E8' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          What information do you collect and share?
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          We only collect publicly available information from organization websites, public filings, and information that organizations directly submit through our forms. We do not share private contact information—profiles link to organization websites where visitors can find your preferred contact methods. All content is for educational purposes only.
        </p>
      </section>

      <section className="p-6 rounded-xl" style={{ backgroundColor: '#FFF4E6' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          How do I update my organization's information?
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Claim your organization's profile through the "Claim Your Profile" form. Once claimed, you can update your description, focus areas, contact details, geographic information, worldview alignment, and any other details. The accuracy of information depends on organizations keeping their profiles current.
        </p>
      </section>

      <section className="p-6 rounded-xl" style={{ backgroundColor: '#E0F2EF' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
          Can I add multiple projects for my organization?
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Yes. Organizations can submit as many project briefs as they want through the "Submit a Project" form. This helps the field understand the specific initiatives you're working on, not just that your organization exists. Projects can be linked to validated problems from our framework to show what gaps you're addressing.
        </p>
      </section>
    </div>
  );
}
