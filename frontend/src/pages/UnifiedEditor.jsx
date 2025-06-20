"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import EditiorNavbar from "../components/EditiorNavbar"
import Editor from "@monaco-editor/react"
import JoditEditor from "jodit-react"
import { MdLightMode, MdDarkMode } from "react-icons/md"
import { AiOutlineExpandAlt, AiOutlineCompress } from "react-icons/ai"
import { BiPlay, BiSave } from "react-icons/bi"
import { HiOutlineCode } from "react-icons/hi"
import { api_base_url } from "../helper"
import { useParams } from "react-router-dom"

const UnifiedEditor = () => {
  const [tab, setTab] = useState("html")
  const [isLightMode, setIsLightMode] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Web Code Editor States
  const [htmlCode, setHtmlCode] = useState("<h1>Hello world</h1>")
  const [cssCode, setCssCode] = useState("body { background-color: #f4f4f4; }")
  const [jsCode, setJsCode] = useState("// some comment")
  const [isSaving, setIsSaving] = useState(false)

  // Document Editor States (simplified)
  const [docContent, setDocContent] = useState("")
  const [docTitle, setDocTitle] = useState("Untitled Document")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [tempTitle, setTempTitle] = useState("")
  const [docSaveStatus, setDocSaveStatus] = useState("saved")
  const [isDocSaving, setIsDocSaving] = useState(false)

  const { projectID } = useParams()
  const editor = useRef(null)

  const changeTheme = () => {
    setIsLightMode(!isLightMode)
    if (!isLightMode) {
      document.body.classList.add("lightMode")
    } else {
      document.body.classList.remove("lightMode")
    }
  }

  const run = () => {
    const html = htmlCode
    const css = `<style>${cssCode}</style>`
    const js = `<script>${jsCode}</script>`
    const iframe = document.getElementById("iframe")

    if (iframe) {
      iframe.srcdoc = html + css + js
    }
  }

  // Web Code Project Save
  const saveProject = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(api_base_url + "/updateProject", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          projId: projectID,
          htmlCode: htmlCode,
          cssCode: cssCode,
          jsCode: jsCode,
        }),
      })

      const data = await response.json()
      if (data.success) {
        const successIndicator = document.createElement("div")
        successIndicator.className = "fixed z-50 px-4 py-2 text-white bg-green-500 rounded-lg shadow-lg top-4 right-4"
        successIndicator.textContent = "Project saved successfully!"
        document.body.appendChild(successIndicator)
        setTimeout(() => {
          document.body.removeChild(successIndicator)
        }, 3000)
      } else {
        alert("Something went wrong")
      }
    } catch (err) {
      console.error("Error saving project:", err)
      alert("Failed to save project. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  // Document Save Functions (manual save only)
  const saveDocument = async () => {
    setIsDocSaving(true)
    setDocSaveStatus("saving")

    try {
      const response = await fetch(api_base_url + "/saveDocument", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          projectId: projectID,
          content: docContent,
          title: docTitle,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setDocSaveStatus("saved")
        // Show success notification
        const successIndicator = document.createElement("div")
        successIndicator.className = "fixed z-50 px-4 py-2 text-white bg-green-500 rounded-lg shadow-lg top-4 right-4"
        successIndicator.textContent = "Document saved successfully!"
        document.body.appendChild(successIndicator)
        setTimeout(() => {
          document.body.removeChild(successIndicator)
        }, 3000)
      } else {
        setDocSaveStatus("error")
        alert("Failed to save document: " + data.message)
      }
    } catch (err) {
      console.error("Error saving document:", err)
      setDocSaveStatus("error")
      alert("Failed to save document. Please try again.")
    } finally {
      setIsDocSaving(false)
    }
  }

  const loadDocument = async () => {
    try {
      const response = await fetch(api_base_url + "/getDocument", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          projectId: projectID,
        }),
      })

      const data = await response.json()

      if (data.success && data.document) {
        setDocContent(data.document.content || "")
        setDocTitle(data.document.title || "Untitled Document")
        setDocSaveStatus("saved")
      } else {
        // New document or no document found
        setDocContent("")
        setDocTitle("Untitled Document")
        setDocSaveStatus("saved")
      }
    } catch (error) {
      console.error("Error loading document:", error)
      // Set defaults on error
      setDocContent("")
      setDocTitle("Untitled Document")
      setDocSaveStatus("saved")
    }
  }

  // Title editing functions (simplified)
  const handleTitleEdit = () => {
    setTempTitle(docTitle)
    setIsEditingTitle(true)
  }

  const saveTitleEdit = () => {
    if (tempTitle.trim()) {
      setDocTitle(tempTitle.trim())
    }
    setIsEditingTitle(false)
  }

  const cancelTitleEdit = () => {
    setTempTitle("")
    setIsEditingTitle(false)
  }

  // Fixed JoditEditor configuration
  const joditConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start writing your document...",
      height: 600,
      theme: "default",
      toolbarButtonSize: "middle",
      showCharsCounter: false,
      showWordsCounter: false,
      toolbarSticky: false,
      toolbarAdaptive: false,
      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "|",
        "align",
        "|",
        "link",
        "image",
        "|",
        "undo",
        "redo",
        "|",
        "fullsize",
      ],
      uploader: {
        insertImageAsBase64URI: true,
      },
      removeButtons: [],
      disablePlugins: [],
      events: {},
      extraButtons: [],
    }),
    [],
  )

  // Fixed content change handler for document
  const handleDocContentChange = (newContent) => {
    setDocContent(newContent)
    // Mark as unsaved when content changes
    if (docSaveStatus === "saved") {
      setDocSaveStatus("unsaved")
    }
  }

  useEffect(() => {
    setTimeout(() => {
      run()
    }, 200)
  }, [htmlCode, cssCode, jsCode])

  useEffect(() => {
    fetch(api_base_url + "/getProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        projId: projectID,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.project) {
          setHtmlCode(data.project.htmlCode || "<h1>Hello world</h1>")
          setCssCode(data.project.cssCode || "body { background-color: #f4f4f4; }")
          setJsCode(data.project.jsCode || "// some comment")
        }
      })
      .catch((error) => {
        console.error("Error loading project:", error)
      })
  }, [projectID])

  // Load document when switching to docs tab
  useEffect(() => {
    if (tab === "docs") {
      loadDocument()
    }
  }, [tab, projectID])

  // Fixed keyboard shortcuts with proper dependencies
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault()
        if (tab === "docs") {
          saveDocument()
        } else {
          saveProject()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [tab, docContent, docTitle, htmlCode, cssCode, jsCode, projectID])

  const tabConfig = {
    html: { icon: "🌐", color: "border-orange-500 bg-orange-500/10 text-orange-400" },
    css: { icon: "🎨", color: "border-blue-500 bg-blue-500/10 text-blue-400" },
    js: { icon: "⚡", color: "border-yellow-500 bg-yellow-500/10 text-yellow-400" },
    docs: { icon: "📝", color: "border-green-500 bg-green-500/10 text-green-400" },
  }

  // Simplified document header
  const renderDocumentHeader = () => {
    if (tab !== "docs") return null

    return (
      <div className="px-6 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📝</span>
              {isEditingTitle ? (
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={saveTitleEdit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveTitleEdit()
                    if (e.key === "Escape") cancelTitleEdit()
                  }}
                  className="px-2 py-1 text-lg font-medium text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-green-500"
                  autoFocus
                />
              ) : (
                <h1
                  onClick={handleTitleEdit}
                  className="text-lg font-medium text-white transition-colors duration-200 cursor-pointer hover:text-green-400"
                >
                  {docTitle}
                </h1>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 text-sm text-gray-400 bg-gray-700 rounded">
              {docSaveStatus === "saving" && (
                <div className="w-3 h-3 border border-green-500 rounded-full animate-spin border-t-transparent"></div>
              )}
              {docSaveStatus === "saved" && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
              {docSaveStatus === "error" && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
              {docSaveStatus === "unsaved" && <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>}
              <span>
                {docSaveStatus === "saving"
                  ? "Saving..."
                  : docSaveStatus === "saved"
                    ? "Saved"
                    : docSaveStatus === "unsaved"
                      ? "Unsaved changes"
                      : "Not saved"}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden text-white bg-gray-900">
      <EditiorNavbar />

      {/* Document Header (only for docs tab) */}
      {renderDocumentHeader()}

      {/* Main Content */}
      <div className={`flex ${tab === "docs" ? "h-[calc(100vh-180px)]" : "h-[calc(100vh-60px)]"}`}>
        {/* Editor Section */}
        <div
          className={`transition-all duration-300 ${isExpanded || tab === "docs" ? "w-full" : "w-1/2"} flex flex-col`}
        >
          {/* Enhanced Tab Bar */}
          <div className="bg-gray-800 border-b border-gray-700">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center space-x-1">
                {Object.entries(tabConfig).map(([tabName, config]) => (
                  <button
                    key={tabName}
                    onClick={() => setTab(tabName)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      tab === tabName ? `${config.color} border` : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    <span className="text-sm">{config.icon}</span>
                    <span className="text-sm tracking-wide uppercase">
                      {tabName === "js" ? "JavaScript" : tabName === "docs" ? "Document" : tabName}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-3">
                {tab !== "docs" && (
                  <>
                    <button
                      onClick={run}
                      className="flex items-center px-3 py-2 space-x-2 transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      <BiPlay className="text-lg" />
                      <span className="text-sm font-medium">Run</span>
                    </button>

                    <button
                      onClick={saveProject}
                      disabled={isSaving}
                      className="flex items-center px-3 py-2 space-x-2 transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-800"
                    >
                      <BiSave className="text-lg" />
                      <span className="text-sm font-medium">{isSaving ? "Saving..." : "Save"}</span>
                    </button>
                  </>
                )}

                {tab === "docs" && (
                  <button
                    onClick={saveDocument}
                    disabled={isDocSaving}
                    className="flex items-center px-3 py-2 space-x-2 transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-800"
                  >
                    <BiSave className="text-lg" />
                    <span className="text-sm font-medium">{isDocSaving ? "Saving..." : "Save"}</span>
                  </button>
                )}

                <div className="w-px h-6 bg-gray-600"></div>

                <button
                  onClick={changeTheme}
                  className="p-2 text-gray-400 transition-colors duration-200 rounded-lg hover:text-white hover:bg-gray-700"
                  title={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
                >
                  {isLightMode ? <MdDarkMode className="text-xl" /> : <MdLightMode className="text-xl" />}
                </button>

                {tab !== "docs" && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 text-gray-400 transition-colors duration-200 rounded-lg hover:text-white hover:bg-gray-700"
                    title={isExpanded ? "Show preview" : "Expand editor"}
                  >
                    {isExpanded ? (
                      <AiOutlineCompress className="text-xl" />
                    ) : (
                      <AiOutlineExpandAlt className="text-xl" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="relative flex-1">
            {tab === "html" && (
              <Editor
                onChange={(value) => {
                  setHtmlCode(value || "")
                }}
                height="100%"
                theme={isLightMode ? "vs-light" : "vs-dark"}
                language="html"
                value={htmlCode}
                options={{
                  fontSize: 14,
                  fontFamily: "JetBrains Mono, Consolas, Monaco, monospace",
                  lineNumbers: "on",
                  wordWrap: "on",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 20, bottom: 20 },
                }}
              />
            )}
            {tab === "css" && (
              <Editor
                onChange={(value) => {
                  setCssCode(value || "")
                }}
                height="100%"
                theme={isLightMode ? "vs-light" : "vs-dark"}
                language="css"
                value={cssCode}
                options={{
                  fontSize: 14,
                  fontFamily: "JetBrains Mono, Consolas, Monaco, monospace",
                  lineNumbers: "on",
                  wordWrap: "on",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 20, bottom: 20 },
                }}
              />
            )}
            {tab === "js" && (
              <Editor
                onChange={(value) => {
                  setJsCode(value || "")
                }}
                height="100%"
                theme={isLightMode ? "vs-light" : "vs-dark"}
                language="javascript"
                value={jsCode}
                options={{
                  fontSize: 14,
                  fontFamily: "JetBrains Mono, Consolas, Monaco, monospace",
                  lineNumbers: "on",
                  wordWrap: "on",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 20, bottom: 20 },
                }}
              />
            )}
            {tab === "docs" && (
              <div className="h-full overflow-hidden bg-white">
                <div className="h-full">
                  <JoditEditor
                    ref={editor}
                    value={docContent}
                    config={joditConfig}
                    tabIndex={1}
                    onBlur={(newContent) => handleDocContentChange(newContent)}
                    onChange={(newContent) => handleDocContentChange(newContent)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Section (only for code tabs) */}
        {!isExpanded && tab !== "docs" && (
          <div className="flex flex-col w-1/2 bg-white">
            <div className="flex items-center justify-between px-6 py-3 bg-gray-100 border-b border-gray-200">
              <div className="flex items-center space-x-2 text-gray-600">
                <HiOutlineCode className="text-lg" />
                <span className="text-sm font-medium">Live Preview</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>

            <iframe id="iframe" className="flex-1 bg-white" title="output" style={{ border: "none" }} />
          </div>
        )}
      </div>
    </div>
  )
}

export default UnifiedEditor
