type TUser = User;
type TResult = Result;
type TMovie = Movie;
type TCompany = Company;
type TDialogProps = DialogProps;
type TTask = Task;
type TPoll = Poll;
type TAnswer = Answer;
type TPTO = PTO;
type TSurvey = Survey;
type TQuestion = SurveyQuestion;

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  img_url: string;
  updated_at: Date;
  created_at: Date;
  position: string;
  work_start: Date;
  work_end: Date;
  is_working: boolean;
  is_on_vacation: boolean;
  is_on_break: boolean;
}

interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface Result {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface Company {
  _id: string;
  name: string;
  email: string;
  logoUrl: string;
  users: User[];
}

interface DialogProps {
  open: boolean;
  setOpen: (v: boolean) => void;
}

interface Task {
  id: number;
  title: string;
  description: string;
  priority: number;
  assigned_by_id: number;
  assigned_to_id: number;
  assigned_by: User;
  assigned_to: User;
  deadline: Date;
  company_id: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface Poll {
  id: number;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  starts_on: Date;
  ends_on: Date;
  questions: string[];
  created_by_id: number;
  created_by: User;
  company: Company;
  company_id: number;
  answered_by_users: User;
  answered_by: number[];
}

interface Answer {
  id: number;
  poll_id: number;
  answered_by_id: number;
  poll: Poll;
  answered_by: User;
  answer: string;
  created_at: Date;
}

interface PTO {
  id: number;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  send_by_id: number;
  send_by: User;
  status: string;
  company_id: number;
  company: Company;
  accepted: boolean;
  start_date: Date;
  end_date: Date;
}

interface Survey {
  id: number;
  created_at: Date;
  updated_at: Date;
  title: string;
  created_by_id: number;
  created_by: User;
  company_id: number;
  start_date: Date;
  end_date: Date;
}

interface SurveyQuestion {
  id: number;
  created_at: Date;
  updated_at: Date;
  title: string;
  type: string;
  answers: string[];
  survey_id: number;
  input_type: string;
}
