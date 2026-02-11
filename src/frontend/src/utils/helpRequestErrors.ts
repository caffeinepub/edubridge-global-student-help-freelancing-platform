/**
 * Maps backend errors from help request creation to user-friendly messages
 */
export function getHelpRequestErrorMessage(error: unknown): string {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Check for authorization/permission errors
  if (errorMessage.includes('Unauthorized') || errorMessage.includes('Only authenticated users can create requests')) {
    return 'You do not have permission to submit work requests. Please log in to continue.';
  }
  
  if (errorMessage.includes('Only users can create requests')) {
    return 'Please log in to submit a work request.';
  }
  
  // Check for validation errors
  if (errorMessage.includes('Request not found')) {
    return 'The request could not be found.';
  }
  
  // Generic backend error
  if (errorMessage.includes('Actor not available')) {
    return 'Unable to connect to the service. Please try again.';
  }
  
  // Default error message
  return 'Failed to submit your request. Please try again.';
}
