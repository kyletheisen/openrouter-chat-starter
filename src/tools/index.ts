import { Tool } from '../types/tools';

export const helloWorldTool: Tool = {
  name: 'hello_world',
  description: 'A simple tool that returns a hello world message',
  execute: async () => {
    return 'Hello, World!';
  }
};

export const howAreYouTool: Tool = {
  name: 'how_are_you',
  description: 'A tool that responds to how are you',
  execute: async () => {
    return "I'm doing great, thanks for asking!";
  }
};

export const availableTools: Tool[] = [
  helloWorldTool,
  howAreYouTool
]; 