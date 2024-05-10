<template>
  <div class="page">
    <div class="page-body">
      <div class="login-box">
        <n-card v-if="!$route.query.userId" title="LOGIN" :bordered="false">
          <n-form
            ref="formRef"
            :label-width="80"
            :model="formValue"
            :rules="rules"
          >
            <n-form-item label="UserId" path="userId">
              <n-input v-model:value="formValue.userId" placeholder="输入UserID" />
            </n-form-item>
            <n-form-item label="Username" path="username">
              <n-input v-model:value="formValue.username" placeholder="输入Username" />
            </n-form-item>
            <n-form-item>
              <n-button attr-type="button" @click="handleValidateClick">
                CONNECT
              </n-button>
            </n-form-item>
          </n-form>
        </n-card>
        <n-card title="webrtc" :bordered="true">
          <div class="video-box">
            <video controls ref="videoRef" width="150"></video>
          </div>
        </n-card>
        <n-button @click="start">start</n-button>
        <n-button @click="initWebrtc">call</n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { io, Socket } from 'socket.io-client';
import { FormInst, useMessage } from 'naive-ui';
import { useRoute, useRouter } from 'vue-router';

const formRef = ref<FormInst | null>(null);
const videoRef = ref<any>(null);
const message = useMessage();
const $router = useRouter();
const $route = useRoute();
const formValue = ref({
  userId: $route.query.userId || '',
  username: $route.query.username || ''
});
const rules = ref({
  userId: {
    required: true,
    message: '请输入UserID',
    trigger: 'blur',
  },
  username: {
    required: true,
    message: '请输入Username',
    trigger: ['input', 'blur'],
  },
});
const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      // toConnectWebsocket();
      $router.replace({
        path: '/client',
        query: {
          userId: formValue.value.userId,
          username: formValue.value.username,
        }
      });
    } else {
      console.log(errors);
      message.error('参数有误');
    }
  });
};
let socket: Socket;
const toConnectWebsocket = () => {
  console.log('mounted');
  socket = io('https://webrtc.m771688.cn/signaling', {
    transports: ['websocket'],
    query: {
      userId: formValue.value.userId,
      username: formValue.value.username,
    },
  });
  // socket.on('connect', () => {
  //   console.log(socket.id);
  //   socket.emit('msg', '6666');
  // });
  socket.onAny((eventName, data) => {
    console.log(eventName, data);
  });
}

const iceConfiguration = {
  iceServers: [
    {
      urls: 'stun:81.68.194.209:30003'
    },
    {
      urls: 'turn:81.68.194.209:30003',
      username: '1',
      credential: '1'
    }
  ]
}

// let localStream: any = null;
const offerOptions: RTCOfferOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true
};

const start = () => {
  toConnectWebsocket();
  // window.navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(async (stream) => {
  //   videoRef.value.srcObject = stream;
  //   localStream = stream;
  //   videoRef.value.play();
  // });
}

const initWebrtc = async () => {
  const pc = new RTCPeerConnection(iceConfiguration);
  pc.onicecandidate = (e) => {
    console.log('e.candidate', e.candidate);
    socket.emit('cecandidate', e.candidate);
  }
  socket.on('cecandidate', (data) => {
    pc.addIceCandidate(data);
  });

  pc.ontrack = (e) => {
    videoRef.value.srcObject = e.streams[0];
    videoRef.value.play();
  };


  socket.on('sdp', async (data) => {
    pc.setRemoteDescription(data);
    const offer = await pc.createAnswer(offerOptions);
    pc.setLocalDescription(offer);

    socket.emit('sdp', offer);
  });


  /*window.navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(async (stream) => {
    videoRef.value.srcObject = stream;
    videoRef.value.play();

    const offerOptions = {
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    };

    const localConnection = new RTCPeerConnection({});
    const remoteConnection = new RTCPeerConnection({});
    localConnection.addEventListener('icecandidate', e => {
      console.log(e.candidate);
      remoteConnection.addIceCandidate(e.candidate);
    });

    const sendChannel = localConnection.createDataChannel("sendChannel");
    sendChannel.onopen = (data) => {
      console.log('onopen', data);
    };
    sendChannel.onclose = (data) => {
      console.log('onopen', data);
    };
    stream.getTracks().forEach((Track) => {
      localConnection.addTrack(Track, stream);
    });


    remoteConnection.addEventListener('icecandidate', e => {
      localConnection.addIceCandidate(e.candidate);
    });

    // const sendremoteChannel = localConnection.createDataChannel("sendChannel");
    // const remoteOffer = await remoteConnection.createOffer(offerOptions)
    remoteConnection.ontrack = (track) => {
      console.log(track);
      videoRef2.value.srcObject = track.streams[0];
      videoRef.value.play();
    }
    remoteConnection.onicecandidate = () => {

    }
    const localOffer = await localConnection.createOffer(offerOptions)
    console.log(localOffer);
    localConnection.setLocalDescription(localOffer);
    remoteConnection.setRemoteDescription(localOffer);

    const answer = await remoteConnection.createAnswer();
    remoteConnection.setLocalDescription(answer);
    localConnection.setRemoteDescription(answer);
  });*/
}

watchEffect(() => {
  console.log($route);
  if($route.query.userId) {
    // toConnectWebsocket();
  }
});

onMounted(() => {
  // initWebrtc();
});
</script>