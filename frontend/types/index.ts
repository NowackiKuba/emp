type TUser = User;
type TResult = Result;
type TMovie = Movie;
type TCompany = Company;
type TDialogProps = DialogProps;

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  imgUrl: string;
  updatedAt: Date;
  createdAt: Date;
  position: string;
  workStart: Date;
  workEnd: Date;
  isWorking: boolean;
  isOnVacation: boolean;
  isOnBreak: boolean;
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
