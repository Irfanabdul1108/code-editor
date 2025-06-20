import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import ListCard from '../components/ListCard';
import GridCard from '../components/GridCard';
import { api_base_url } from '../helper';
import { useNavigate } from 'react-router-dom';
import { BiSearch, BiPlus, BiGridAlt, BiListUl } from 'react-icons/bi';
import { MdOutlineCreate } from 'react-icons/md';
import { HiOutlineCode, HiOutlineFolder } from 'react-icons/hi';

const Home = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [projTitle, setProjTitle] = useState("");
  const navigate = useNavigate();
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userError, setUserError] = useState("");
  const [isGridLayout, setIsGridLayout] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filter data based on search query
  const filteredData = data ? data.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const createProj = async (e) => {
    if (projTitle.trim() === "") {
      alert("Please Enter Project Title");
      return;
    }

    try {
      const response = await fetch(api_base_url + "/createProject", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: projTitle,
          userId: localStorage.getItem("userId")
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsCreateModelShow(false);
        setProjTitle("");
        navigate(`/editior/${data.projectId}`);
        // Refresh projects list
        getProj();
      } else {
        alert("Something Went Wrong");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    }
  };

  const getProj = async () => {
    try {
      const response = await fetch(api_base_url + "/getProjects", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId")
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setData(result.projects);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await fetch(api_base_url + "/getUserDetails", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId")
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setUserData(result.user);
      } else {
        setUserError(result.message);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUserError("Failed to load user details");
    }
  };

  useEffect(() => {
    Promise.all([getProj(), getUserDetails()]);
  }, []);

  return (
    <div className="min-h-screen text-white bg-gray-900">
      <Navbar isGridLayout={isGridLayout} setIsGridLayout={setIsGridLayout} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black">
        <div className="px-6 py-12 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                <HiOutlineCode className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                  Welcome back, {userData ? userData.username : "Developer"}! 👋
                </h1>
                <p className="mt-2 text-gray-400">Ready to build something amazing today?</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <BiSearch className="absolute text-xl text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="py-3 pl-12 pr-4 transition-all duration-200 bg-gray-800 border border-gray-700 outline-none w-80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={() => setIsCreateModelShow(true)}
                className="flex items-center px-6 py-3 space-x-2 font-medium transition-all duration-200 transform bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl hover:scale-105"
              >
                <BiPlus className="text-xl" />
                <span>New Project</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-8 mx-auto max-w-7xl">
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-gray-800 border border-gray-700 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Projects</p>
                <p className="text-3xl font-bold text-white">{data ? data.length : 0}</p>
              </div>
              <HiOutlineFolder className="text-3xl text-blue-400" />
            </div>
          </div>
          
          <div className="p-6 bg-gray-800 border border-gray-700 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">This Month</p>
                <p className="text-3xl font-bold text-white">
                  {data ? data.filter(project => {
                    const projectDate = new Date(project.date);
                    const currentDate = new Date();
                    return projectDate.getMonth() === currentDate.getMonth() && 
                           projectDate.getFullYear() === currentDate.getFullYear();
                  }).length : 0}
                </p>
              </div>
              <MdOutlineCreate className="text-3xl text-green-400" />
            </div>
          </div>
          
          <div className="p-6 bg-gray-800 border border-gray-700 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Projects</p>
                <p className="text-3xl font-bold text-white">{filteredData.length}</p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Projects Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Your Projects</h2>
            <p className="mt-1 text-gray-400">
              {filteredData.length > 0 
                ? `${filteredData.length} project${filteredData.length > 1 ? 's' : ''} found` 
                : "No projects found"}
            </p>
          </div>
          
          <div className="flex items-center p-1 space-x-2 bg-gray-800 border border-gray-700 rounded-xl">
            <button
              onClick={() => setIsGridLayout(true)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isGridLayout 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <BiGridAlt className="text-xl" />
            </button>
            <button
              onClick={() => setIsGridLayout(false)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                !isGridLayout 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <BiListUl className="text-xl" />
            </button>
          </div>
        </div>

        {/* Projects Display */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredData.length > 0 ? (
          <div className={`${isGridLayout ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}`}>
            {filteredData.map((item, index) => (
              isGridLayout ? (
                <GridCard key={index} item={item} />
              ) : (
                <ListCard key={index} item={item} />
              )
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <HiOutlineCode className="mx-auto mb-4 text-6xl text-gray-600" />
            <h3 className="mb-2 text-xl font-semibold text-gray-400">No projects yet</h3>
            <p className="mb-6 text-gray-500">Create your first project to get started!</p>
            <button
              onClick={() => setIsCreateModelShow(true)}
              className="inline-flex items-center px-6 py-3 space-x-2 font-medium transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
            >
              <BiPlus className="text-xl" />
              <span>Create New Project</span>
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Create Project Modal */}
      {isCreateModelShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-8 bg-gray-800 border border-gray-700 shadow-2xl rounded-2xl">
            <div className="mb-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                <MdOutlineCreate className="text-2xl text-white" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">Create New Project</h3>
              <p className="text-gray-400">Give your project a name to get started</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Project Name
                </label>
                <input
                  onChange={(e) => setProjTitle(e.target.value)}
                  value={projTitle}
                  type="text"
                  placeholder="Enter project name..."
                  className="w-full px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 bg-gray-700 border border-gray-600 outline-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              
              <div className="flex pt-4 space-x-3">
                <button
                  onClick={createProj}
                  className="flex items-center justify-center flex-1 px-6 py-3 space-x-2 font-medium transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
                >
                  <MdOutlineCreate className="text-lg" />
                  <span>Create Project</span>
                </button>
                
                <button
                  onClick={() => {
                    setIsCreateModelShow(false);
                    setProjTitle("");
                  }}
                  className="flex-1 px-6 py-3 font-medium text-gray-300 transition-all duration-200 bg-gray-700 hover:bg-gray-600 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;