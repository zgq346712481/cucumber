include default.mk

.deps: cucumber_messages/messages_pb2.py

cucumber_messages/messages_pb2.py: messages.proto
	mkdir -p cucumber_messages
	protoc -I. --python_out cucumber_messages $<

clean:
	rm -f cucumber_messages/messages_pb2.py
