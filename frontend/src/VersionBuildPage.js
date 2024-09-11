import React, { useEffect, useState } from 'react';

const fetchVersions = async () => {
  try {
    const response = await fetch("http://localhost:5001/")
    if(!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return(data);
} 
catch (error) {
  console.error('Error fetching data', error)
}
};

const VersionBuildPage = () => {
  const [versionData, setVersionData] = useState([]);
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);

  useEffect(() => {
    const x = async () => {
      try{
      const y = await fetchVersions();
      setVersionData(y);     
    }
    catch (error) {
      console.log('Error: ' + error)
    }
  }
    x();
    }, []);

  // Helper function to find the version of a clicked build
  const getVersionByBuild = (buildId) => {
    for (let version in versionData) {
      if (versionData[version].includes(buildId)) {
        return version;
      }
    }
    return null;
  };

  // Handle clicking on a build
  const handleBuildClick = (buildId) => {
    const version = getVersionByBuild(buildId);
    setSelectedBuild(buildId);
    setSelectedVersion(version);
  };

  // Handle adding a new build
  const handleAddBuild = (versionNumber) => {
    const newBuildNumber = prompt("Enter new build number:");
    if (newBuildNumber) {
      setVersionData({
        ...versionData,
        [versionNumber]: [...versionData[versionNumber], newBuildNumber]
      });
    }
  };

  // Handle deleting a build
  const handleDeleteBuild = (versionNumber, buildId) => {
    const updatedBuilds = versionData[versionNumber].filter((b) => b !== buildId);
    setVersionData({
      ...versionData,
      [versionNumber]: updatedBuilds,
    });
    setSelectedBuild(null);
    setSelectedVersion(null);
  };

  return (
    <div className="container">
      <a href='PoolSelection'>
      <button>Archiructure of the Pools</button>
      </a>
      <h1>Application Versions & Builds</h1>

      <div className="build-list">
        <h2>Builds</h2>
        {versionData && versionData.map(({versionNumber, builds}) => (
          <div key={versionNumber}>
            <h3>{`Version: ${versionNumber}`}</h3>
            <button onClick={() => handleAddBuild(versionNumber)}>Add Build</button>
            <ul>
              {builds && builds.map(({buildId}) => (
                <li key={buildId}>
                  <span onClick={() => handleBuildClick(buildId)} style={{ cursor: 'pointer' }}>
                    Build: {buildId}
                  </span>
                  <button onClick={() => handleDeleteBuild(versionNumber, buildId)} style={{ marginLeft: '10px' }}>
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
