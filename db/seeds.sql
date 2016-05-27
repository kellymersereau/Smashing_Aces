-- #Schema to set up info for each individual card

INSERT INTO users (username, email, password_hash, photo, play_money, bit_coins) VALUES ('kelly', 'kelly.mersereau@gmail.com','$2a$10$Nu4oBiV9kjMSD0sxnrhYkOLXgaHtfC3wb5xB5b8to.YtGvmVyz2ZC', 'http://s3.amazonaws.com/assets.prod.vetstreet.com/2a/cd/ee484be546418f40cc3cbc194b52/kitten-in-arms-thinkstockphotos-106397271-335lc070915jpg.jpg', 50000, 500); -- password_hash is password when decrypted

INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('spades',2,'s02.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('spades',3,'s03.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('spades',4,'s04.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('spades',5,'s05.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('spades',6,'s06.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('spades',7,'s07.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('spades',8,'s08.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('spades',9,'s09.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('spades',10,'s10.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('spades',11,'s11.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('spades',12,'s12.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('spades',13,'s13.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('spades',14,'s14.bmp', 'b1fv.bmp');

INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('clubs',2,'c02.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('clubs',3,'c03.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('clubs',4,'c04.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('clubs',5,'c05.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('clubs',6,'c06.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('clubs',7,'c07.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('clubs',8,'c08.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('clubs',9,'c09.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('clubs',10,'c10.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('clubs',11,'c11.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('clubs',12,'c12.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('clubs',13,'c13.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('clubs',14,'c14.bmp', 'b1fv.bmp');

INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('diamonds',2,'d02.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('diamonds',3,'d03.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('diamonds',4,'d04.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('diamonds',5,'d05.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('diamonds',6,'d06.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('diamonds',7,'d07.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('diamonds',8,'d08.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('diamonds',9,'d09.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('diamonds',10,'d10.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('diamonds',11,'d11.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('diamonds',12,'d12.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('diamonds',13,'d13.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('diamonds',14,'d14.bmp', 'b1fv.bmp');

INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('hearts',2,'h02.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('hearts',3,'h03.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('hearts',4,'h04.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('hearts',5,'h05.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('hearts',6,'h06.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('hearts',7,'h07.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('hearts',8,'h08.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('hearts',9,'h09.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('hearts',10,'h10.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('hearts',11,'h11.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('hearts',12,'h12.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('hearts',13,'h13.bmp', 'b1fv.bmp');
INSERT INTO cards (suite,rank,image_link, back_image_link) VALUES ('hearts',14,'h14.bmp', 'b1fv.bmp');

