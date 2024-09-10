import React, { useState } from 'react';

// Sample data for versions and builds
const initialVersionData = {
  '1.0.0': ['100', '101', '102'],
  '1.1.0': ['200', '201'],
  '2.0.0': ['300', '301', '302', '303'],
};

const VersionBuildPage = () => {
  const [versionData, setVersionData] = useState(initialVersionData);
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);

  // Helper function to find the version of a clicked build
  const getVersionByBuild = (build) => {
    for (let version in versionData) {
      if (versionData[version].includes(build)) {
        return version;
      }
    }
    return null;
  };

  // Handle clicking on a build
  const handleBuildClick = (build) => {
    const version = getVersionByBuild(build);
    setSelectedBuild(build);
    setSelectedVersion(version);
  };

  // Handle adding a new build
  const handleAddBuild = (version) => {
    const newBuildNumber = prompt("Enter new build number:");
    if (newBuildNumber) {
      setVersionData({
        ...versionData,
        [version]: [...versionData[version], newBuildNumber],
      });
    }
  };

  // Handle deleting a build
  const handleDeleteBuild = (version, build) => {
    const updatedBuilds = versionData[version].filter((b) => b !== build);
    setVersionData({
      ...versionData,
      [version]: updatedBuilds,
    });
    setSelectedBuild(null);
    setSelectedVersion(null);
  };

  return (
    <div className="container">
      <h1>Application Versions & Builds</h1>

      <div className="build-list">
        <h2>Builds</h2>
        {Object.entries(versionData).map(([version, builds]) => (
          <div key={version}>
            <h3>{`Version: ${version}`}</h3>
            <button onClick={() => handleAddBuild(version)}>Add Build</button>
            <ul>
              {builds.map((build) => (
                <li key={build}>
                  <span onClick={() => handleBuildClick(build)} style={{ cursor: 'pointer' }}>
                    Build: {build}
                  </span>
                  <button onClick={() => handleDeleteBuild(version, build)} style={{ marginLeft: '10px' }}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {selectedBuild && selectedVersion && (
        <div className="details">
          <h2>Build Details</h2>
          <p><strong>Build:</strong> {selectedBuild}</p>
          <p><strong>Version:</strong> {selectedVersion}</p>
        </div>
      )}
    </div>
  );
};

export default VersionBuildPage;
