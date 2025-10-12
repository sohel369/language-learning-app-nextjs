'use client';

import Link from 'next/link';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Authentication Error</h1>
          <p className="text-white/70">
            There was a problem with your authentication. This could be due to:
          </p>
        </div>

        {/* Error Details */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          <ul className="space-y-3 text-white/80 text-sm">
            <li className="flex items-start space-x-2">
              <span className="text-red-400 mt-1">•</span>
              <span>Invalid or expired authentication code</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-400 mt-1">•</span>
              <span>Network connection issues</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-400 mt-1">•</span>
              <span>Authentication provider error</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-400 mt-1">•</span>
              <span>Session timeout</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/auth/login"
            className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Login</span>
          </Link>

          <Link
            href="/"
            className="w-full text-white/70 hover:text-white transition-colors text-center block py-2"
          >
            Go to Homepage
          </Link>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-white/50 text-sm">
            If the problem persists, please contact support
          </p>
        </div>
      </div>
    </div>
  );
}

