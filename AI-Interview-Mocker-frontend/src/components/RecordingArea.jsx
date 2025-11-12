import React from 'react'

const RecordingArea = () => {
  return (
    <div>
      <Card className="bg-white border border-slate-200 rounded-2xl shadow-lg flex-1">
        <CardContent className="p-8 h-full flex flex-col">
          {/* Camera Preview */}
          <div className="flex-1 bg-black rounded-xl overflow-hidden mb-6 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                <User className="h-12 w-12 text-slate-400" />
              </div>
              <p className="text-slate-400">Camera Preview</p>
            </div>
          </div>

          {/* Recording Controls */}
          <div className="space-y-4">
            <div className="text-center">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                className={`cursor-pointer px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 ${
                  isRecording
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-lg transform hover:scale-105"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="h-5 w-5 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Record Answer
                  </>
                )}
              </Button>
            </div>

            {/* Recording Status */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isRecording ? "bg-red-500 animate-pulse" : "bg-slate-300"
                    }`}
                  />
                  <span
                    className={
                      isRecording
                        ? "text-red-600 font-medium"
                        : "text-slate-500"
                    }
                  >
                    Recording: {isRecording ? "true" : "false"}
                  </span>
                </div>
              </div>

              {isRecording && (
                <div className="text-emerald-600 font-medium">
                  Recording Time: {formatTime(recordingTime)}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <Button
                onClick={nextQuestion}
                disabled={currentQuestion >= questions.length - 1}
                variant="outline"
                className="cursor-pointer border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SkipForward className="h-4 w-4 mr-2" />
                Next Question
              </Button>

              {currentQuestion === questions.length - 1 && (
                <Button
                  onClick={finishInterview}
                  className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Finish Interview
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RecordingArea
