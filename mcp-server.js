#!/usr/bin/env node

/**
 * MCP Server for GitHub Copilot - Playwright Assistant
 * Provides context about Playwright tests and configuration
 * Enhanced with npm packages: fast-glob, dotenv, chalk
 */

const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');
const chalk = require('chalk');
require('dotenv').config();

const projectRoot = process.env.PLAYWRIGHT_PROJECT_ROOT || process.cwd();

/**
 * Read and return project configuration
 */
function getProjectInfo() {
  const configPath = path.join(projectRoot, 'playwright.config.js');
  const packagePath = path.join(projectRoot, 'package.json');
  
  let config = {};
  let packageInfo = {};
  
  try {
    if (fs.existsSync(packagePath)) {
      packageInfo = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    }
    if (fs.existsSync(configPath)) {
      config = { path: configPath, exists: true };
    }
  } catch (e) {
    console.error('Error reading project files:', e);
  }
  
  return { config, packageInfo };
}

/**
 * List all test files using fast-glob
 */
async function getTestFiles() {
  const testsDir = path.join(projectRoot, 'tests');
  const testFiles = [];
  
  try {
    const files = await glob('**/*.{spec,test}.js', {
      cwd: testsDir,
      absolute: false
    });
    testFiles.push(...files);
  } catch (e) {
    console.error('Error reading test files:', e);
  }
  
  return testFiles;
}

/**
 * MCP Tool: Get Playwright Project Overview
 */
async function handleToolCall(toolName, toolInput) {
  switch (toolName) {
    case 'get_project_info':
      return getProjectInfo();
    
    case 'get_test_files':
      return await getTestFiles();
    
    case 'get_test_content': {
      const testFile = path.join(projectRoot, 'tests', toolInput.filename);
      if (fs.existsSync(testFile)) {
        return {
          filename: toolInput.filename,
          content: fs.readFileSync(testFile, 'utf-8')
        };
      }
      return { error: 'Test file not found' };
    }
    
    default:
      return { error: 'Unknown tool' };
  }
}

/**
 * MCP Server Implementation
 * Listens on stdin/stdout for protocol messages
 */
function startServer() {
  let buffer = '';
  
  process.stdin.on('data', async (data) => {
    buffer += data.toString();
    
    // Process complete lines
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      try {
        const message = JSON.parse(line);
        
        if (message.method === 'initialize') {
          process.stdout.write(JSON.stringify({
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: [
                {
                  name: 'get_project_info',
                  description: 'Get Playwright project information and configuration',
                  inputSchema: { type: 'object', properties: {} }
                },
                {
                  name: 'get_test_files',
                  description: 'List all test files in the project',
                  inputSchema: { type: 'object', properties: {} }
                },
                {
                  name: 'get_test_content',
                  description: 'Get the content of a specific test file',
                  inputSchema: {
                    type: 'object',
                    properties: {
                      filename: { type: 'string', description: 'Test file name' }
                    },
                    required: ['filename']
                  }
                }
              ]
            }
          }) + '\n');
        }
        
        else if (message.method === 'tools/call') {
          const result = await handleToolCall(message.params.name, message.params.arguments);
          process.stdout.write(JSON.stringify({
            type: 'tool_result',
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          }) + '\n');
        }
      } catch (e) {
        process.stdout.write(JSON.stringify({
          error: 'Invalid message: ' + e.message
        }) + '\n');
      }
    }
  });
  
  process.stdin.on('end', () => {
    process.exit(0);
  });
}

// Start the server
startServer();
