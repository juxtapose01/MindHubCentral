import React from 'react';

const ResourcesPage = () => {
  const resources = [
    { name: "OSU Counseling", contact: "(405) 744-5458", link: "https://go.okstate.edu/undergraduate-academics/global-engagement/counseling-services.html" },
    { name: "National Suicide Lifeline", contact: "988", link: "https://988lifeline.org/" },
    { name: "Stillwater Medical Center ER", contact: "(405) 372-1480", link: "https://www.stillwater-medical.org/locations/stillwater-medical-center" },
    { name: "Crisis Text Line", contact: "Text HOME to 741741", link: "https://www.crisistextline.org/" },
  ];

  return (
    <section className="resources-page">
      <h2>Local Mental Health Resources</h2>
      <p>Here are some resources available for Stillwater residents. Reach out for support when you need it.</p>
      <ul className="resource-list">
        {resources.map((resource, index) => (
          <li key={index} className="resource-item">
            <h3>{resource.name}</h3>
            <p>Contact: {resource.contact}</p>
            <a href={resource.link} target="_blank" rel="noopener noreferrer">Learn More</a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ResourcesPage;