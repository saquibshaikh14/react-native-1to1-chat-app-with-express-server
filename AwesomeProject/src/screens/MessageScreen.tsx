import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, FlatList, Text } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import apiCall from '../api/apiAdapter';
import constant from '../utility/constant';



const MessageScreen: React.FC = () => {
    const authContext = useContext(AuthContext);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);

    const flatListRef = useRef<FlatList>(null);

    const handleSendMessage = () => {
        if (!message) return;

        console.log("=======authContext.user=======", authContext!.user);
        const newMessage = {
            receiver: authContext!.user?.availableList[0],
            sender: authContext!.user?.username,
            message: message
        }

        apiCall('POST', constant.SEND_MESSAGE, { body: newMessage }).then(res => {
            console.log("====line 34 ===", res)
            setMessage('');
        }).catch(err => { console.log(err) });

    };

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    useEffect(() => {
        //call for fetching message
        // const timer = setInterval(()=>{
        async function fetchMesage() {
            console.log("Request for new message");
            const response = await apiCall<ApiResponse<Message[]>>('POST', constant.RECEIVE_MESSAGE, {
                body: {
                    "sender": authContext?.user?.username,
                    "receiver": authContext?.user?.availableList[0]
                }
            });

            console.log("===res message fetch====",response);
            if (!response.ok) {
                if (response.error?.errorCode === 502) {
                    await fetchMesage(); //timedout reconnect
                } else {
                    console.log(response.error);
                    await new Promise(resolve => setTimeout(resolve, 5000)); //wait for s1 second and reconnect
                    await fetchMesage();
                }
            } else {
                const newMessages = response.data?.data;
                if (newMessages && newMessages.length) {
                    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
                }
                // await new Promise(resolve => setTimeout(resolve, 5000)); //wait for s1 second and reconnect
                await fetchMesage();
            }
            /*.then(res => {
                console.log("=====res getmessage====", res);
                if (res.ok) {
                    const messages = res.data!.data;
                    if (messages && messages.length) {
                        setMessages((prevMessages) => [...prevMessages, ...messages]);
                    }
                }
                // setTimeout(()=>{fetchMesage()}, 2000);
                await
            }).catch(e => console.log("====messagerequest====", e));
            */
        }

        fetchMesage();
    }, [])

    return (
        <View style={styles.container}>
            {/* Message List */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={[styles.messageContainer, item.sender === authContext?.user?.username ? styles.senderMessage : styles.receiverMessage]}>
                        <Text style={styles.messageContent}>{item.message}</Text>
                    </View>
                )}
                contentContainerStyle={styles.messageList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                onLayout={() => flatListRef.current?.scrollToEnd()}
            />

            {/* Message Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.messageInput}
                    placeholder="Message..."
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    multiline
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    messageList: {
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingBottom: 10,
        justifyContent: 'flex-end',
    },
    messageContainer: {
        marginBottom: 10,
        backgroundColor: '#F4F4F4',
        borderRadius: 8,
        padding: 10,
    },
    senderMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#80c1ff',
    },
    receiverMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#F4F4F4',
    },
    messageContent: {
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#EDEDED',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    messageInput: {
        flex: 1,
        paddingVertical: 8,
        fontSize: 16,
        lineHeight: 24,
    },
    sendButton: {
        width: 70,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#66ff66',
        borderRadius: 25,
        marginLeft: 10
    },
    sendButtonText: {
        color: '#333',
        fontWeight: '500'
    },
    sendIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        tintColor: '#FFF',
    },
});

export default MessageScreen;
