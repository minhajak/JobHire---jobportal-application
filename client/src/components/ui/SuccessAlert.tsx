  const SuccessAlert: React.FC<{ message?: string }> = ({ message }) =>
  message ? (
    <div className="mb-4 text-sm text-green-700 bg-green-100 p-2 rounded">
      {message}
    </div>
  ) : null;
export default SuccessAlert;