export function getHelpRequestErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message: string }).message;
    
    if (message.includes('Only authenticated users can create work requests')) {
      return 'Please log in to submit a work request.';
    }
    
    if (message.includes('Only students, clients, and businesses can submit work requests')) {
      return 'Only students, clients, and businesses can submit work requests.';
    }
    
    if (message.includes('Unauthorized')) {
      return 'You do not have permission to perform this action.';
    }
    
    if (message.includes('Request not found')) {
      return 'The requested item could not be found.';
    }
    
    return message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}
