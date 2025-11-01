import React from 'react';

export default function WorldviewFramework() {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-lg mb-4" style={{ color: '#4A4643' }}>
          The worldview framework helps make explicit the diverse perspectives that shape
          the psychedelic ecosystem. Understanding these worldviews is essential for effective
          coordination and collaboration across the field.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-3" style={{ color: '#2B180A' }}>
          What Are Worldviews?
        </h3>
        <p className="mb-3">
          Worldviews are distinct perspectives that reflect how different parts of the field
          understand psychedelics and their role in society. These aren't boxes to put people
          in—they're lenses for understanding the range of approaches in the psychedelic ecosystem.
        </p>
        <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded">
          <p className="text-sm font-medium" style={{ color: '#2B180A' }}>
            <strong>Important:</strong> Most organizations and individuals align with multiple
            worldviews. Think of this as a "heat map" of your alignments, not as mutually
            exclusive categories.
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-3" style={{ color: '#2B180A' }}>
          The Seven Worldviews
        </h3>
        <p className="mb-4">
          These seven categories emerged from systematic analysis of 138 stakeholder interviews
          conducted between 2023-2025. They were refined through collaborative workshops at
          the national summit.
        </p>
        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
            <h4 className="font-bold mb-2" style={{ color: '#317E6D' }}>
              1. Medical/Clinical
            </h4>
            <p className="text-sm">
              Views psychedelics primarily as medical treatments for mental health conditions.
              Emphasizes clinical trials, FDA approval, and integration into healthcare systems.
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
            <h4 className="font-bold mb-2" style={{ color: '#317E6D' }}>
              2. Harm Reduction
            </h4>
            <p className="text-sm">
              Prioritizes reducing risks and negative outcomes from psychedelic use. Focuses
              on education, safety resources, and meeting people where they are without judgment.
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
            <h4 className="font-bold mb-2" style={{ color: '#317E6D' }}>
              3. Spiritual/Religious
            </h4>
            <p className="text-sm">
              Understands psychedelics as sacred tools for spiritual growth, religious
              experience, or connection with the divine. Emphasizes set, setting, and ceremony.
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
            <h4 className="font-bold mb-2" style={{ color: '#317E6D' }}>
              4. Scientific Research
            </h4>
            <p className="text-sm">
              Views psychedelics as tools for understanding consciousness, neuroscience, and
              psychology. Prioritizes rigorous research methodology and evidence generation.
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
            <h4 className="font-bold mb-2" style={{ color: '#317E6D' }}>
              5. Social Justice
            </h4>
            <p className="text-sm">
              Centers equity, access, and addressing historical harms (especially related to
              the War on Drugs). Prioritizes community-led solutions and reparative justice.
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
            <h4 className="font-bold mb-2" style={{ color: '#317E6D' }}>
              6. Personal Growth/Wellness
            </h4>
            <p className="text-sm">
              Sees psychedelics as tools for self-improvement, creativity, and optimization.
              Emphasizes individual autonomy and personal development.
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
            <h4 className="font-bold mb-2" style={{ color: '#317E6D' }}>
              7. Policy Reform
            </h4>
            <p className="text-sm">
              Focuses on changing laws and regulations around psychedelics. Works toward
              decriminalization, legalization, or regulated access frameworks.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-3" style={{ color: '#2B180A' }}>
          How to Use This Framework
        </h3>
        <div className="space-y-3">
          <p>
            <strong>Find Your Alignment:</strong> Explore which worldviews resonate with
            your organization's mission and values. Don't feel limited to one—most
            organizations span multiple worldviews.
          </p>
          <p>
            <strong>Discover Allies:</strong> See who else shares your worldview alignments.
            This can help you find potential collaboration partners and understand who's
            working toward similar goals.
          </p>
          <p>
            <strong>Understand Differences:</strong> Recognize where different worldviews
            might have divergent priorities or approaches. This helps navigate potential
            conflicts and find common ground.
          </p>
          <p>
            <strong>See Overlap:</strong> Notice where outcomes and problems span multiple
            worldviews. These are often the best opportunities for broad collaboration.
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-3" style={{ color: '#2B180A' }}>
          Descriptive, Not Prescriptive
        </h3>
        <div className="space-y-3">
          <p>
            This framework describes the field as it is, not as it "should be." We're not
            advocating for any particular worldview—we're providing a map to help you navigate
            the diversity of perspectives in the ecosystem.
          </p>
          <p>
            These categories emerged from what we heard in 138 interviews, not from what we
            invented. They reflect the language and priorities that stakeholders themselves
            used to describe their work.
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-3" style={{ color: '#2B180A' }}>
          A Living Framework
        </h3>
        <p>
          As the psychedelic field evolves, new worldviews may emerge or existing ones may
          shift. This framework is meant to be updated and refined based on ongoing field
          input.
        </p>
        <p className="mt-3">
          If you think we're missing a worldview, or if you feel these categories don't
          adequately capture the diversity of the field, please let us know through the
          feedback mechanisms throughout the tool.
        </p>
      </section>
    </div>
  );
}
