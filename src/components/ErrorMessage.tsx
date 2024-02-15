interface ErrorMessageProps {
    message: string;
  }
  
  const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
    <div className="error-message text-red-600">Error: {message}</div>
  );
  
  export default ErrorMessage;
  