import React from 'react';

const images = [
  'https://www.dropbox.com/scl/fi/7tky24j25r14j8a5iywvx/54bcb2c4-3b25-4346-a90e-ae9579776cd5.jpg?rlkey=kn7p3q4jqfn1mim3sqa76pida&st=radlr9x1&raw=1',
  'https://www.dropbox.com/scl/fi/1u4re3uokp3h2ygjmw0p5/1031094_1168.jpg?rlkey=h413dum7eqczz286es4216nc8&st=hr7cbzvp&raw=1',
  'https://www.dropbox.com/scl/fi/r8lospdkhp2o5pg144gjj/Namibian_Hockey_Action_Close-up.png?rlkey=4nzrner555gcg54htk5cwwf5s&st=xe7xybue&raw=1',
  'https://www.dropbox.com/scl/fi/clxxem3b8jkc956w6v97j/Creative_Suite_3D_Product_Box.png?rlkey=akm5psygop1jv3llov57qyvzp&st=t4jgiqmf&raw=1',
  'https://www.dropbox.com/scl/fi/hf83ove9og2psj4pvcbh9/Graphics_Design_Box_3D.png?rlkey=2lsj6r2fn7nh8wtahjt29jtc8&st=ql1xmoo5&raw=1',
];

const PhotoGrid: React.FC = () => {
  return (
    <div className="absolute inset-0">
      <div className="grid grid-cols-5 h-full">
        {images.map((src, index) => (
          <div key={index} className="relative">
            <img
              src={src}
              alt={`service-image-${index}`}
              className="w-full h-full object-cover object-center absolute inset-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGrid;
