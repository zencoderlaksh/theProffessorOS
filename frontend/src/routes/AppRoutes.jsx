import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';
import LessonBuilder from '../pages/LessonBuilder/LessonBuilder';
import ExampleRepository from '../pages/ExampleRepository/ExampleRepository';
import AnalogyRepository from '../pages/AnalogyRepository/AnalogyRepository';
import DiagramRepository from '../pages/DiagramRepository/DiagramRepository';
import AssignmentBuilder from '../pages/AssignmentBuilder/AssignmentBuilder';
import QuestionBank from '../pages/QuestionBank/QuestionBank';
import ProjectRepository from '../pages/ProjectRepository/ProjectRepository';
import CodePlayground from '../pages/CodePlayground/CodePlayground';
import ResourceLibrary from '../pages/ResourceLibrary/ResourceLibrary';
import TeachingNotes from '../pages/TeachingNotes/TeachingNotes';
import LecturePlanner from '../pages/LecturePlanner/LecturePlanner';
import LectureFlow from '../pages/LectureFlow/LectureFlow';
import RelationshipEngine from '../pages/RelationshipEngine/RelationshipEngine';
import CourseBuilder from '../pages/CourseBuilder/CourseBuilder';
import UniversityMode from '../pages/UniversityMode/UniversityMode';
import PromptLibrary from '../pages/PromptLibrary/PromptLibrary';
import Settings from '../pages/Settings/Settings';
import DiscoveryDashboard from '../pages/DiscoveryDashboard/DiscoveryDashboard';
import Bookmarks from '../pages/Bookmarks/Bookmarks';
import PersonalGrowth from '../pages/PersonalGrowth/PersonalGrowth';
import Login from '../pages/Login/Login';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/lesson-builder" element={<LessonBuilder />} />
      <Route path="/lecture-flow" element={<LectureFlow />} />
      <Route path="/example-repository" element={<ExampleRepository />} />
      <Route path="/analogy-repository" element={<AnalogyRepository />} />
      <Route path="/diagram-repository" element={<DiagramRepository />} />
      <Route path="/assignment-builder" element={<AssignmentBuilder />} />
      <Route path="/question-bank" element={<QuestionBank />} />
      <Route path="/project-repository" element={<ProjectRepository />} />
      <Route path="/code-playground" element={<CodePlayground />} />
      
      {/* Phase 2 */}
      <Route path="/resource-library" element={<ResourceLibrary />} />
      <Route path="/teaching-notes" element={<TeachingNotes />} />
      <Route path="/lecture-planner" element={<LecturePlanner />} />
      
      {/* New AI Phase 2 Routes */}
      <Route path="/relationship-engine" element={<RelationshipEngine />} />
      <Route path="/course-builder" element={<CourseBuilder />} />
      <Route path="/university-mode" element={<UniversityMode />} />
      <Route path="/prompt-library" element={<PromptLibrary />} />
      <Route path="/settings" element={<Settings />} />

      {/* Phase 3 Routes */}
      <Route path="/discovery" element={<DiscoveryDashboard />} />
      <Route path="/bookmarks" element={<Bookmarks />} />
      <Route path="/personal-growth" element={<PersonalGrowth />} />
    </Routes>
  );
};

export default AppRoutes;
