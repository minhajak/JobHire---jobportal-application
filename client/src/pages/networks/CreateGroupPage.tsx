import { useNavigate, type NavigateFunction } from "react-router-dom";
import { ArrowRightIcon } from "../../components";
import { GroupForm } from "../../features/networks";

const CreateGroupPage = () => {
    const navigate:NavigateFunction=useNavigate();
  return (
    <div>
      <div className="flex flex-row items-center gap-2 py-4 px-4 " onClick={()=>navigate(-1)}>
        <ArrowRightIcon  /> Go Back
      </div>
      <GroupForm />
    </div>
  );
};

export default CreateGroupPage;
