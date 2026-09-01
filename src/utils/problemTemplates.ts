export const getStarterTemplate = (slug: string, language: string): string => {
  const lang = language.toUpperCase();

  switch (slug) {
    case 'binary-search-problem':
      if (lang === 'JAVA') {
        return `public class Solution {\n    public int solve(int[] nums, int target) {\n        // Write your O(log n) solution here\n        return -1;\n    }\n}`;
      } else if (lang === 'PYTHON') {
        return `class Solution:\n    def solve(self, nums: list[int], target: int) -> int:\n        # Write your O(log n) solution here\n        return -1`;
      } else if (lang === 'JAVASCRIPT') {
        return `function solve(nums, target) {\n  // Write your O(log n) solution here\n  return -1;\n}`;
      } else if (lang === 'CPP') {
        return `class Solution {\npublic:\n    int solve(vector<int>& nums, int target) {\n        // Write your O(log n) solution here\n        return -1;\n    }\n};`;
      }
      break;

    case 'two-sum':
      if (lang === 'JAVA') {
        return `public class Solution {\n    public int[] solve(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}`;
      } else if (lang === 'PYTHON') {
        return `class Solution:\n    def solve(self, nums: list[int], target: int) -> list[int]:\n        # Write your solution here\n        return []`;
      } else if (lang === 'JAVASCRIPT') {
        return `function solve(nums, target) {\n  // Write your solution here\n  return [];\n}`;
      } else if (lang === 'CPP') {
        return `class Solution {\npublic:\n    vector<int> solve(vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};`;
      }
      break;

    case 'valid-parentheses':
      if (lang === 'JAVA') {
        return `public class Solution {\n    public boolean solve(String s) {\n        // Write your solution here\n        return false;\n    }\n}`;
      } else if (lang === 'PYTHON') {
        return `class Solution:\n    def solve(self, s: str) -> bool:\n        # Write your solution here\n        return False`;
      } else if (lang === 'JAVASCRIPT') {
        return `function solve(s) {\n  // Write your solution here\n  return false;\n}`;
      } else if (lang === 'CPP') {
        return `class Solution {\npublic:\n    bool solve(string s) {\n        // Write your solution here\n        return false;\n    }\n};`;
      }
      break;

    case 'maximum-subarray':
      if (lang === 'JAVA') {
        return `public class Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}`;
      } else if (lang === 'PYTHON') {
        return `class Solution:\n    def solve(self, nums: list[int]) -> int:\n        # Write your solution here\n        return 0`;
      } else if (lang === 'JAVASCRIPT') {
        return `function solve(nums) {\n  // Write your solution here\n  return 0;\n}`;
      } else if (lang === 'CPP') {
        return `class Solution {\npublic:\n    int solve(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};`;
      }
      break;

    default:
      break;
  }

  // Default fallback template
  if (lang === 'JAVA') {
    return `public class Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}`;
  } else if (lang === 'PYTHON') {
    return `class Solution:\n    def solve(self, nums: list[int]) -> int:\n        # Write your solution here\n        return 0`;
  } else if (lang === 'JAVASCRIPT') {
    return `function solve(nums) {\n  // Write your solution here\n  return 0;\n}`;
  } else {
    return `class Solution {\npublic:\n    int solve(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};`;
  }
};
