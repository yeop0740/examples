package org.heeyeop.springcoreprinciplesadvanced.trace.logtrace;

import org.heeyeop.springcoreprinciplesadvanced.trace.TraceStatus;

public interface LogTrace {

    TraceStatus begin(String message);

    void end(TraceStatus status);

    void exception(TraceStatus status, Exception e);

}
